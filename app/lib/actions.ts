'use server';

import { z } from 'zod'; // Libreria para validacion de esquemas
import { revalidatePath } from 'next/cache'; // Funcion para revalidar la cache de una ruta
import { redirect } from 'next/navigation'; // Funcion para navegar a una ruta
import posgres from 'postgres'; // Libreria para conectar a Postgres

// Conectar a la base de datos Postgres usando la variable de entorno
const sql = posgres(process.env.POSTGRES_URL!, { ssl:'require' });

// crear un esquema de validacion
const FormSchema = z.object({
	id: z.string(),
	customerId: z.string(),
	amount: z.coerce.number(),
	status: z.enum(['pending', 'paid']),
	date: z.string()
});

// Crear un nuevo esquema en base al anterior pero omitiendo id y date
const CreateInvoice = FormSchema.omit({ id:true, date: true});

// Funcion para crear una nueva factura
export async function createInvoice(formData: FormData) {
	// Validar los datos del formulario usando el esquema anterior
	const { customerId, amount, status } = CreateInvoice.parse({
		customerId: formData.get('customerId'),
		amount: formData.get('amount'),
		status: formData.get('status')
	});

	const amountInCents = amount * 100; // Crear la cantidad en centavos
	const date = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD

	// Insertar la nueva factura en la base de datos
	await sql`
		INSERT INTO invoices (customer_id, amount, status, date)
		VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
	`;

	// Revalidar la cache de la ruta /invoices
	revalidatePath('/dashboard/invoices');

	// Redirigir a la ruta /invoices
	redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true}); // Crear un nuevo esquema en base al anterior pero omitiendo id y date

export async function updateInvoice(id: string, formData: FormData) {
	const { customerId, amount, status } = UpdateInvoice.parse({
		customerId: formData.get('customerId'),
		amount: formData.get('amount'),
		status: formData.get('status')
	});

	const amountInCents = amount * 100; // Crear la cantidad en centavos

	// Actualizar la factura en la base de datos
	await sql`
		UPDATE invoices
		SET customer_id = ${customerId},
			amount = ${amountInCents},
			status = ${status}
		WHERE id = ${id}
	`;

	revalidatePath('/dashboard/invoices'); // Revalidar la cache de la ruta /invoices
	redirect('/dashboard/invoices'); // Redirigir a la ruta /invoices
}

export async function deleteInvoice(id: string) {
	await sql`DELETE FROM invoices WHERE id = ${id}`;

	revalidatePath('/dashboard/invoices');
};