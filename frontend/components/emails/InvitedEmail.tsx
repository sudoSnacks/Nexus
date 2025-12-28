import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Text,
    Section,
    Link,
    Hr,
    Row,
    Column,
} from '@react-email/components';

interface InvitedEmailProps {
    attendeeDetails: {
        name: string;
        bookingId: string;
        bookingDate: string;
        ticketType: string;
    };
    eventDetails: {
        name: string;
        date: string;
        location: string;
        organizer: string;
        url: string;
    };
    qrCodeUrl: string;
}

export const InvitedEmail = ({ attendeeDetails, eventDetails, qrCodeUrl }: InvitedEmailProps) => (
    <Html>
        <Head />
        <Preview>Your Registration Confirmation for {eventDetails.name}</Preview>
        <Body style={main}>
            <Container style={container}>

                {/* Header Branding */}
                <Section style={{ textAlign: 'center' }}>
                    <Heading style={brandHeader}>GDG Nexus</Heading>
                </Section>

                <Section style={card}>
                    <Heading style={h1}>Your Registration Confirmation</Heading>

                    <Text style={text}>Dear <strong>{attendeeDetails.name}</strong>,</Text>

                    <Text style={text}>
                        We confirm your registration for <strong>{eventDetails.name}</strong>.
                    </Text>

                    <Text style={text}>
                        For the latest details about the event, visit: <Link href={eventDetails.url} style={link}>{eventDetails.url}</Link>
                    </Text>

                    <Text style={text}>
                        Your registration details are as follows:
                    </Text>

                    <Section style={detailsTable}>
                        <Row style={tableRow}>
                            <Column style={labelCol}>Name:</Column>
                            <Column style={valueCol}><strong>{attendeeDetails.name}</strong></Column>
                        </Row>
                        <Row style={tableRow}>
                            <Column style={labelCol}>Booking ID:</Column>
                            <Column style={valueCol}>{attendeeDetails.bookingId}</Column>
                        </Row>
                        <Row style={tableRow}>
                            <Column style={labelCol}>Booking Date:</Column>
                            <Column style={valueCol}>{attendeeDetails.bookingDate}</Column>
                        </Row>
                        <Row style={tableRow}>
                            <Column style={labelCol}>Ticket Name:</Column>
                            <Column style={valueCol}>{attendeeDetails.ticketType}</Column>
                        </Row>
                        <Row style={tableRow}>
                            <Column style={labelCol}>Organiser Name:</Column>
                            <Column style={valueCol}>{eventDetails.organizer}</Column>
                        </Row>
                        <Row style={tableRow}>
                            <Column style={labelCol}>Event Date:</Column>
                            <Column style={valueCol}>{eventDetails.date}</Column>
                        </Row>
                        <Row style={tableRow}>
                            <Column style={labelCol}>Venue:</Column>
                            <Column style={valueCol}>{eventDetails.location}</Column>
                        </Row>
                    </Section>

                    <Section style={qrContainer}>
                        <Img src={qrCodeUrl} width="150" height="150" alt="Ticket QR Code" style={qrImage} />
                    </Section>

                    <Text style={text}>
                        Looking forward to seeing you at the event.
                    </Text>

                    <Text style={text}>
                        Best Regards,<br />
                        Team {eventDetails.organizer}
                    </Text>

                    <Hr style={hr} />
                    <Text style={footer}>
                        Powered By GDG Nexus
                    </Text>

                </Section>

            </Container>
        </Body>
    </Html>
);

const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '40px 0',
    maxWidth: '600px',
};

const card = {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
};

const brandHeader = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
    textTransform: 'uppercase' as const,
};

const h1 = {
    color: '#333',
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    marginBottom: '24px',
};

const text = {
    color: '#525f7f',
    fontSize: '16px',
    lineHeight: '24px',
    marginBottom: '16px',
};

const link = {
    color: '#3B82F6',
    textDecoration: 'underline',
};

const detailsTable = {
    marginTop: '20px',
    marginBottom: '30px',
};

const tableRow = {
    marginBottom: '8px',
};

const labelCol = {
    width: '140px',
    color: '#8898aa',
    fontSize: '14px',
    verticalAlign: 'top',
};

const valueCol = {
    color: '#333',
    fontSize: '14px',
    fontWeight: '500',
};

const qrContainer = {
    textAlign: 'center' as const,
    margin: '32px 0',
};

const qrImage = {
    display: 'inline-block',
};

const hr = {
    borderColor: '#e6ebf1',
    margin: '20px 0',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
    textAlign: 'center' as const,
};
