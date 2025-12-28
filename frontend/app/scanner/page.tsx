import { isHelper } from '@/utils/roles';
import { redirect } from 'next/navigation';
import Scanner from '@/components/Scanner';

export default async function ScannerPage() {
    if (!await isHelper()) {
        redirect('/');
    }

    return <Scanner />;
}
