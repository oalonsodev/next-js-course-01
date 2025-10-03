import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';

export default async function page(props: { params: Promise< { id: string }> }) {
  const params = await props.params; // Espera a que se resuelva la promesa para obtener los parámetros
  const id = params.id; // Extrae el ID de los parámetros

  const [invoice, customers] = await Promise.all([ // Realiza ambas llamadas a la API en paralelo
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

	return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}