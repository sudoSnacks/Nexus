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

interface CertificateEmailProps {
    userName: string;
    eventName: string;
}

export const CertificateEmail = ({ userName, eventName }: CertificateEmailProps) => (
    <Html>
        <Head />
        <Preview>Your Certificate for {eventName}</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>Here is your Certificate!</Heading>
                <Text style={text}>Hi {userName},</Text>
                <Text style={text}>
                    Thank you for attending <strong>{eventName}</strong>. We hope you learned a lot and had a great time!
                </Text>
                <Text style={text}>
                    Please find your certificate of participation attached to this email.
                </Text>
                <Text style={footer}>
                    Keep learning,<br />
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
