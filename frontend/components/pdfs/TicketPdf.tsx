import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 12,
        fontFamily: 'Helvetica',
        color: '#333333',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    headerLeft: {
        flexDirection: 'column',
    },
    headerRight: {
        width: 150,
        height: 150,
    },
    headerText: {
        fontSize: 14,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        paddingBottom: 5,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        width: 120,
        fontWeight: 'bold',
        color: '#000000',
    },
    value: {
        flex: 1,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 10,
        color: '#666666',
        borderTopWidth: 1,
        borderTopColor: '#eeeeee',
        paddingTop: 10,
    },
    qrCode: {
        width: '100%',
        height: '100%',
    }
});

interface TicketProps {
    eventDetails: {
        name: string;
        date: string;
        location: string;
        organizer: string;
        logoUrl?: string;
    };
    attendeeDetails: {
        name: string;
        email: string;
        bookingId: string;
        bookingDate: string;
        ticketType: string;
    };
    qrCodeUrl: string;
}

export const TicketPdf = ({ eventDetails, attendeeDetails, qrCodeUrl }: TicketProps) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Header: Logo (Left) vs QR Code (Right) */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                {/* Large Logo Area - roughly 60% width */}
                <View style={{ width: '60%' }}>
                    {eventDetails.logoUrl ? (
                        <Image
                            src={eventDetails.logoUrl}
                            style={{
                                width: 250,
                                height: 120,
                                objectFit: 'contain',
                                alignSelf: 'flex-start'
                            }}
                        />
                    ) : (
                        <View style={{ height: 120, justifyContent: 'center' }}>
                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#4f46e5' }}>
                                {eventDetails.name}
                            </Text>
                        </View>
                    )}
                </View>

                {/* QR Code Area */}
                <View style={{ width: 120, height: 120 }}>
                    <Image src={qrCodeUrl} style={{ width: '100%', height: '100%' }} />
                </View>
            </View>

            {/* Event Name & Date (Below Header) */}
            <View style={{ marginBottom: 30 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 5 }}>
                    {eventDetails.name}
                </Text>
                <Text style={{ fontSize: 12, color: '#666' }}>
                    {eventDetails.date}
                </Text>
            </View>

            {/* Booking Details */}
            <View style={{ marginBottom: 20 }}>
                <Text style={styles.sectionTitle}>Booking Information</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Booking ID:</Text>
                    <Text style={styles.value}>{attendeeDetails.bookingId}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Date:</Text>
                    <Text style={styles.value}>{attendeeDetails.bookingDate}</Text>
                </View>
            </View>

            {/* Attendee Details */}
            <View>
                <Text style={styles.sectionTitle}>Attendee Details</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>{attendeeDetails.name}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{attendeeDetails.email}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Ticket:</Text>
                    <Text style={styles.value}>{attendeeDetails.ticketType}</Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text>Presented by {eventDetails.organizer}</Text>
            </View>

        </Page>
    </Document>
);
