import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
} from '@react-email/components';

interface RejectedEmailProps {
    userName: string;
    eventName: string;
}

export const RejectedEmail = ({ userName, eventName }: RejectedEmailProps) => (
    <Html>
        <Head />
        <Preview>Update regarding {eventName}</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>Application Update</Heading>
                <Text style={text}>Hi {userName},</Text>
                <Text style={text}>
                    Thank you for your interest in <strong>{eventName}</strong>.
                </Text>
                <Text style={text}>
                    Due to high demand, we differntly cannot offer you a spot at this time. We really appreciate your enthusiasm and hope to see you at our next event!
                </Text>
                <Text style={text}>
                    Please keep an eye on our events page for future opportunities.
                </Text>
                <Text style={footer}>
                    Best regards,<br />
                    The GDG Nexus Team
                </Text>
            </Container>
        </Body>
    </Html>
);

const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '560px',
};

const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    paddingBottom: '10px',
};

const text = {
    color: '#333',
    fontSize: '16px',
    lineHeight: '26px',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '24px',
    marginTop: '20px',
};
