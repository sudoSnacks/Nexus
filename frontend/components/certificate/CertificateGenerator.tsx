'use client';

import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import QRCode from 'react-qr-code';
import { jsPDF } from 'jspdf';
import { sendCertificateEmail } from '@/app/actions/email';
import { toast } from 'sonner';
import Draggable, { DraggableData } from 'react-draggable';
import Color from 'color';
import { ChevronLeft, ChevronRight, List, MonitorPlay } from 'lucide-react';

interface CertificatePreviewProps {
    name: string;
    color: string;
    font: string;
    fontSize: number;
    fontWeight: string;
    fontStyle: string;
    textDecoration: string;
    position: { x: number; y: number };
    qr: string;
    qrPosition: { x: number; y: number };
    qrSize: number;
    template: string;
    customImage: string | null;
    customImagePosition: { x: number; y: number };
    customImageSize: number;
    innerRef: React.Ref<HTMLDivElement>;
    handleStop: (type: string, data: DraggableData) => void;
}

export class CertificatePreview extends React.PureComponent<CertificatePreviewProps> {
    nameRef: React.RefObject<HTMLHeadingElement | null>;
    qrRef: React.RefObject<HTMLDivElement | null>;
    customImageRef: React.RefObject<HTMLDivElement | null>;

    constructor(props: CertificatePreviewProps) {
        super(props);
        this.nameRef = React.createRef();
        this.qrRef = React.createRef();
        this.customImageRef = React.createRef();
    }

    render() {
        const {
            name,
            color,
            font,
            fontSize,
            fontWeight,
            fontStyle,
            textDecoration,
            position,
            qr,
            qrPosition,
            qrSize,
            template,
            customImage,
            customImagePosition,
            customImageSize,
            innerRef,
            handleStop
        } = this.props;

        const convertedColor = Color(color).hex();

        return (
            <div
                className="relative w-full h-auto border-[7px] border-white"
                style={{ lineHeight: 0, fontSize: 0 }}
                ref={innerRef}
            >
                <style>{`@media print { @page { margin: 0; } body { margin: 0; } }`}</style>
                <img src={template} alt="template" className="w-full h-auto block" />

                <Draggable
                    nodeRef={this.nameRef as React.RefObject<HTMLElement>}
                    position={position}
                    onStop={(e, data) => handleStop('name', data)}
                    bounds="parent"
                    defaultClassName="no-border"
                >
                    <h1
                        ref={this.nameRef}
                        className="absolute cursor-move whitespace-nowrap top-0"
                        style={{
                            color: convertedColor,
                            fontFamily: font,
                            fontSize: `${fontSize}px`,
                            fontWeight: fontWeight,
                            fontStyle: fontStyle,
                            textDecoration: textDecoration,
                            outline: 'none',
                            boxShadow: 'none',
                            backgroundColor: 'transparent',
                            border: 'none',
                        }}
                    >
                        {name || 'Sample Name'}
                    </h1>
                </Draggable>

                {qr && (
                    <Draggable
                        nodeRef={this.qrRef as React.RefObject<HTMLElement>}
                        position={qrPosition}
                        onStop={(e, data) => handleStop('qr', data)}
                        bounds="parent"
                    >
                        <div ref={this.qrRef} className="absolute cursor-move top-0">
                            <QRCode value={qr} size={qrSize} />
                        </div>
                    </Draggable>
                )}

                {customImage && (
                    <Draggable
                        nodeRef={this.customImageRef as React.RefObject<HTMLElement>}
                        position={customImagePosition}
                        onStop={(e, data) => handleStop('customImage', data)}
                        bounds="parent"
                        defaultClassName="draggable-image"
                    >
                        <div
                            ref={this.customImageRef}
                            className="absolute cursor-move top-0"
                            style={{
                                width: `${customImageSize}px`,
                                height: 'auto',
                                zIndex: 10
                            }}
                        >
                            <img
                                src={customImage}
                                alt="Custom"
                                className="w-full h-auto"
                                draggable="false"
                            />
                        </div>
                    </Draggable>
                )}
            </div>
        );
    }
}

interface CertificateGeneratorProps {
    attendees?: { name: string; email: string; id: string }[];
    eventName?: string;
}

function CertificateGenerator({ attendees = [], eventName = 'Event' }: CertificateGeneratorProps) {
    const initialNames = attendees.length > 0 ? attendees.map(a => a.name).join(', ') : '';
    const [names, setNames] = useState(initialNames);
    const [generatedNames, setGeneratedNames] = useState(['Sample Name']);
    const [template, setTemplate] = useState<string | null>(null);
    const [position, setPosition] = useState({ x: 140, y: 140 });
    const [qrPosition, setQrPosition] = useState({ x: 200, y: 200 });
    const [color, setColor] = useState('#000000');
    const [font, setFont] = useState('Arial');
    const [fontSize, setFontSize] = useState(48);
    const [qrSize, setQrSize] = useState(100);
    const [fontWeight, setFontWeight] = useState('normal');
    const [fontStyle, setFontStyle] = useState('normal');
    const [textDecoration, setTextDecoration] = useState('none');
    const [customImage, setCustomImage] = useState<string | null>(null);
    const [customImagePosition, setCustomImagePosition] = useState({ x: 100, y: 100 });
    const [customImageSize, setCustomImageSize] = useState(100);
    const componentRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [input, setInput] = useState('');
    const [qrCode, setQrcode] = useState('');

    const [viewMode, setViewMode] = useState<'list' | 'carousel'>('carousel');
    const [currentIndex, setCurrentIndex] = useState(0);

    const [isSending, setIsSending] = useState(false);
    const [sendProgress, setSendProgress] = useState({ current: 0, total: 0 });

    const handlePrint = useReactToPrint({
        // @ts-expect-error - content is valid in this version but types might be mismatched
        content: () => componentRefs.current[viewMode === 'list' ? 0 : currentIndex],
    });

    const handleDownloadAll = async () => {
        const domtoimage = (await import('dom-to-image-more')).default;
        for (let i = 0; i < componentRefs.current.length; i++) {
            const ref = componentRefs.current[i];
            if (ref) {
                try {
                    const dataUrl = await domtoimage.toPng(ref);
                    const link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = `certificate-${i + 1}.png`;
                    link.click();
                } catch (error) {
                    console.error('Error capturing certificate:', error);
                }
            }
        }
    };

    function handleUploadTemplate(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setTemplate(reader.result as string);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    function handleUploadCustomImage(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setCustomImage(reader.result as string);
            setCustomImagePosition({ x: 100, y: 100 });
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    function handleStop(type: string, data: DraggableData) {
        const newPosition = { x: data.x, y: data.y };

        switch (type) {
            case 'name':
                setPosition(newPosition);
                break;
            case 'qr':
                setQrPosition(newPosition);
                break;
            case 'customImage':
                setCustomImagePosition(newPosition);
                break;
            default:
                break;
        }
    }

    function handleGenerateQrCode() {
        setQrcode(input);
    }

    function handleGenerateCertificates() {
        const nameList = names.split(',').map((name) => name.trim()).filter(n => n.length > 0);
        setGeneratedNames(nameList.length > 0 ? nameList : ['Sample Name']);
        setCurrentIndex(0);
    }

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % generatedNames.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + generatedNames.length) % generatedNames.length);
    };

    const handleImportCheckedIn = () => {
        if (attendees.length === 0) {
            toast.error("No checked-in attendees found.");
            return;
        }
        const namesString = attendees.map(a => a.name).join(', ');
        setNames(namesString);
        setGeneratedNames(attendees.map(a => a.name));
        setCurrentIndex(0);
        toast.success(`Imported ${attendees.length} checked-in attendees.`);
    };

    const handleSendEmails = async () => {
        if (!attendees || attendees.length === 0) {
            toast.error("No attendees to send to.");
            return;
        }

        if (generatedNames.length !== attendees.length) {
            toast.error("Name list length mismatch or data out of sync. Please 'Import Checked-in' to reset before sending.");
            return;
        }

        if (!confirm(`Are you sure you want to send emails to ${attendees.length} attendees? This will generate and email certificates.`)) {
            return;
        }

        setIsSending(true);
        setSendProgress({ current: 0, total: attendees.length });

        for (let i = 0; i < attendees.length; i++) {
            const attendee = attendees[i];
            const ref = componentRefs.current[i];

            if (!ref) {
                console.error(`Ref missing for ${attendee.name}`);
                continue;
            }

            try {
                const domtoimage = (await import('dom-to-image-more')).default;
                const imgDataUrl = await domtoimage.toPng(ref);
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'px',
                    format: [ref.offsetWidth, ref.offsetHeight]
                });
                pdf.addImage(imgDataUrl, 'PNG', 0, 0, ref.offsetWidth, ref.offsetHeight);
                const pdfBase64 = pdf.output('datauristring');

                const res = await sendCertificateEmail({
                    email: attendee.email,
                    name: attendee.name,
                    eventName: eventName,
                    pdfBase64: pdfBase64
                });

                if (!res.success) {
                    toast.error(`Failed to send to ${attendee.email}: ${res.error}`);
                }

                setSendProgress(prev => ({ ...prev, current: i + 1 }));

            } catch (err) {
                console.error(err);
                toast.error(`Error processing ${attendee.name}`);
            }
        }

        setIsSending(false);
        toast.success("Finished sending emails.");
    };

    return (
        <div className="flex flex-col md:flex-row bg-gradient-to-b from-black via-gray-950 to-blue-950">
            {/* Preview Area */}
            <div className="flex-1 p-6 flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-4 text-white">
                    <h2 className="text-xl font-bold">Preview Area</h2>
                    {template && (
                        <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-600">
                            <button
                                onClick={() => setViewMode('carousel')}
                                className={`p-2 rounded-md flex items-center gap-2 ${viewMode === 'carousel' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                title="Carousel View"
                            >
                                <MonitorPlay size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md flex items-center gap-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                title="List View"
                            >
                                <List size={20} />
                            </button>
                        </div>
                    )}
                </div>

                {!template ? (
                    <div className="bg-gray-950 border border-gray-700 p-6 rounded-lg text-gray-100 shadow-lg w-full max-w-4xl">
                        <h2 className="text-2xl lg:text-4xl font-bold mb-8 text-blue-400">How to Use the Certificate Generator</h2>
                        <ol className="list-decimal list-inside space-y-2 lg:space-y-4 lg:text-lg">
                            <li>
                                <span className="font-semibold">Upload</span> a template image for your certificate.
                            </li>
                            <li>
                                <span className="font-semibold">Enter names</span> separated by commas.
                            </li>
                            <li>
                                <span className="font-semibold">Click &quot;Generate&quot;</span> to create your certificates.
                            </li>
                            <li>
                                <span className="font-semibold">Enter QR code data (if any ) </span> if needed.
                            </li>
                            <li>
                                <span className="font-semibold">Customize</span> the font, color, and position for the name and QR code.
                            </li>
                            <li>
                                <span className="font-semibold">Preview and download</span> all generated certificates as PNG files.
                            </li>
                        </ol>
                    </div>
                ) : (
                    <div className="w-full max-w-[90vw] relative">
                        {viewMode === 'list' ? (
                            <div className="grid grid-cols-1 gap-6 w-full">
                                {generatedNames.map((name, index) => (
                                    <div key={index} className="relative shadow-lg rounded-lg overflow-hidden border border-gray-700">
                                        <CertificatePreview
                                            innerRef={(el) => { componentRefs.current[index] = el; }}
                                            name={name}
                                            template={template}
                                            position={position}
                                            qrPosition={qrPosition}
                                            handleStop={handleStop}
                                            color={color}
                                            font={font}
                                            fontSize={fontSize}
                                            qrSize={qrSize}
                                            fontWeight={fontWeight}
                                            fontStyle={fontStyle}
                                            textDecoration={textDecoration}
                                            qr={qrCode}
                                            customImage={customImage}
                                            customImagePosition={customImagePosition}
                                            customImageSize={customImageSize}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center w-full relative group">
                                <div className="relative shadow-lg rounded-lg overflow-hidden border border-gray-700 w-full mb-4">
                                    <CertificatePreview
                                        innerRef={(el) => { componentRefs.current[currentIndex] = el; }}
                                        name={generatedNames[currentIndex]}
                                        template={template}
                                        position={position}
                                        qrPosition={qrPosition}
                                        handleStop={handleStop}
                                        color={color}
                                        font={font}
                                        fontSize={fontSize}
                                        qrSize={qrSize}
                                        fontWeight={fontWeight}
                                        fontStyle={fontStyle}
                                        textDecoration={textDecoration}
                                        qr={qrCode}
                                        customImage={customImage}
                                        customImagePosition={customImagePosition}
                                        customImageSize={customImageSize}
                                    />

                                    {generatedNames.length > 1 && (
                                        <>
                                            <button
                                                onClick={handlePrev}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                                            >
                                                <ChevronLeft size={32} />
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                                            >
                                                <ChevronRight size={32} />
                                            </button>
                                        </>
                                    )}
                                </div>

                                {generatedNames.length > 1 && (
                                    <div className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-full border border-gray-700 mt-2">
                                        <span className="text-gray-300 font-mono text-sm">
                                            Certificate {currentIndex + 1} of {generatedNames.length}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Action Bar */}
            <div className="w-full md:w-1/4 bg-black lg:border-l border-gray-700 p-6 shadow-md md:ml-4">
                <div className="mb-4">
                    <label className="block text-gray-300 font-semibold mb-2">Upload Template</label>
                    <input type="file" accept="image/*" onChange={handleUploadTemplate} className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white" />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-300 font-semibold mb-2">Import Data</label>
                    <button
                        onClick={handleImportCheckedIn}
                        className="w-full bg-emerald-600 text-white p-2 rounded-md hover:bg-emerald-700 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                        <List size={18} /> Import Checked-In Attendees
                    </button>
                    <p className="text-xs text-gray-400 mt-1">resets names to the official checked-in list.</p>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-300 font-semibold mb-2">Enter Names (separated by commas)</label>
                    <textarea
                        rows={4}
                        value={names}
                        spellCheck={false}
                        onChange={(e) => setNames(e.target.value)}
                        placeholder="Enter names, e.g. Mihir Jaiswal, Jhon Doe, ..."
                        className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-300 font-semibold mb-2">Generate Certificates</label>
                    <button
                        onClick={handleGenerateCertificates}
                        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors font-semibold"
                    >
                        Generate
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-300 font-semibold mb-2">Enter QR Code Data</label>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleGenerateQrCode}
                        className="w-full mt-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors font-semibold"
                    >
                        Generate QR Code
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-300 font-semibold mb-2">Font Color</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="h-10 w-20 bg-transparent cursor-pointer rounded-md border border-gray-600"
                        />
                        <span className="text-gray-400 text-sm">{color}</span>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-300 font-semibold mb-2">Font Family</label>
                    <select
                        value={font}
                        onChange={(e) => setFont(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Arial">Arial</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Raleway">Raleway</option>
                        <option value="Playfair Display">Playfair Display</option>
                        <option value="Merriweather">Merriweather</option>
                        <option value="Nunito">Nunito</option>
                        <option value="Ubuntu">Ubuntu</option>
                        <option value="Oswald">Oswald</option>
                        <option value="Dancing Script">Dancing Script</option>
                        <option value="Pacifico">Pacifico</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-300 font-semibold mb-2">Font Size</label>
                    <input
                        type="number"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-300 font-semibold mb-2">Upload Custom Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadCustomImage}
                        className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white"
                    />
                </div>

                {customImage && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-300 font-semibold mb-2">Custom Image Size</label>
                            <input
                                type="number"
                                value={customImageSize}
                                onChange={(e) => setCustomImageSize(Number(e.target.value))}
                                className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <button
                                onClick={() => setCustomImage(null)}
                                className="w-full bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors"
                            >
                                Remove Custom Image
                            </button>
                        </div>
                    </>
                )}

                <div className="mb-4">
                    <label className="block text-gray-300 font-semibold mb-2">QR Code Size</label>
                    <input
                        type="number"
                        value={qrSize}
                        onChange={(e) => setQrSize(Number(e.target.value))}
                        className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-300 font-semibold mb-2">Font Weight</label>
                    <select
                        value={fontWeight}
                        onChange={(e) => setFontWeight(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="bolder">Bolder</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-300 font-semibold mb-2">Font Style</label>
                    <select
                        value={fontStyle}
                        onChange={(e) => setFontStyle(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="normal">Normal</option>
                        <option value="italic">Italic</option>
                        <option value="oblique">Oblique</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-300 font-semibold mb-2">Text Decoration</label>
                    <select
                        value={textDecoration}
                        onChange={(e) => setTextDecoration(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="none">None</option>
                        <option value="underline">Underline</option>
                        <option value="overline">Overline</option>
                        <option value="line-through">Line-through</option>
                    </select>
                </div>

                <div className="flex space-x-4 mb-8">
                    <button
                        onClick={handleDownloadAll}
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    >
                        Download All as PNG
                    </button>
                    <button
                        onClick={handlePrint}
                        className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                    >
                        Print / Save as PDF
                    </button>
                </div>

                <div className="mb-8 border-t border-gray-700 pt-4">
                    <label className="block text-gray-300 font-semibold mb-2">Email Certificates</label>
                    {isSending ? (
                        <div className="w-full bg-gray-800 p-2 rounded-md text-white text-center">
                            Sending: {sendProgress.current} / {sendProgress.total}
                        </div>
                    ) : (
                        <button
                            onClick={handleSendEmails}
                            className="w-full bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!attendees || attendees.length === 0}
                        >
                            Send Certificates via Email
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CertificateGenerator;