import { isHelper } from '@/utils/roles';
import { redirect } from 'next/navigation';
import ScannerPageClient from './client_page';

export default async function ScannerPage() {
    const hasAccess = await isHelper();
    console.log(`ScannerPage access check: ${hasAccess}`);

    if (!hasAccess) {
        console.log('ScannerPage: Redirecting to home due to missing role');
        redirect('/');
    }

    return <ScannerPageClient />;
}
