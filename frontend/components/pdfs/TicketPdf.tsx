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

            {/* Header Row: Booking Details (Left) + QR Code (Right) */}
            <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                    <Text style={styles.headerText}>Booking Date: {attendeeDetails.bookingDate}</Text>
                    <Text style={styles.headerText}>Booking ID: {attendeeDetails.bookingId}</Text>
                </View>
                <View style={styles.headerRight}>
                    <Image src={qrCodeUrl} style={styles.qrCode} />
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
            </View>

            {/* Event Details */}
            <View>
                <Text style={styles.sectionTitle}>Event Details</Text>

                <View style={styles.row}>
                    <Text style={styles.label}>Event Name:</Text>
                    <Text style={styles.value}>{eventDetails.name}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Event Date:</Text>
                    <Text style={styles.value}>{eventDetails.date}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Ticket Name:</Text>
                    <Text style={styles.value}>{attendeeDetails.ticketType}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Organiser Name:</Text>
                    <Text style={styles.value}>{eventDetails.organizer}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Location:</Text>
                    <Text style={styles.value}>{eventDetails.location}</Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text>Powered by GDG Nexus</Text>
            </View>

        </Page>
    </Document>
);
