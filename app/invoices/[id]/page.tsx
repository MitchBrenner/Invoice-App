'use client'
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
 
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Timestamp, collection, deleteDoc, doc, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '@/firebase';
import { useOrganization } from '@clerk/nextjs';
import { useCollection } from 'react-firebase-hooks/firestore';
import toast from 'react-hot-toast';
import StatusBar from '@/components/StatusBar';
import { useRouter } from 'next/navigation';
import {jsPDF} from 'jspdf';
import { saveAs } from 'file-saver';
import { exportPDF } from '@/lib/utils';
import { Invoice } from '@/lib/types';
import { Trash } from 'lucide-react';


// Define the schema for the form
// this uses zod to validate the form
const invoiceSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(1).max(100), // min 3 and max 100 chars
  billTo: z.string({ required_error: 'Bill to is required' }).min(1).max(100),
  shipTo: z.string({ required_error: 'Ship to is required' }).min(1).max(100),
  sendDate: z.string({ required_error: 'Send date is required' }).min(1).max(100),
  userId: z.string(),
  status: z.string(),
  downloadLink: z.string().default(''),
  invoiceNumber: z.number(),
});
type Inputs = z.infer<typeof invoiceSchema>;


// Page component
function page( { params } : {params: {id: string}} ) {

  const { organization } = useOrganization();
  const [ formValues, setFormValues ] = useState<Inputs | null>(null);
  const [ isUpdating, setIsUpdating ] = useState(false);
  const [ isDeleting, setIsDeleting ] = useState(false);
  const router = useRouter();

  // get data from database
  const [docs, loading, error] = useCollection(
    organization && query(
      collection(db, `organizations/${organization!.id}/invoices`),
      where("id", "==", params.id)
    )
  )
  
  // initialize form with values pulled from database
  const form = useForm<Inputs>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      name: formValues?.name === "Untitled Name" ? '' : formValues?.name || '',
      billTo: formValues?.billTo || '',
      shipTo: formValues?.shipTo || '',
      sendDate: formValues?.sendDate || '',
    },
  });

  // Update form values
  useEffect(() => {
    if (!docs || !docs.docs[0]?.data) return;

    if (!form.formState.isValid) form.setValue('status', 'in progress');

    // set initial values from database
    const data = docs?.docs[0]?.data() as Inputs;
    setFormValues(data);
    
    // update form with fetched data
    form.reset(data); 

  }, [docs, form]);

  
  // form action on submit
  const onSubmit: SubmitHandler<Inputs> = async data => {

    setIsUpdating(true);

    handleExport();
    toast.success('Invoice exported successfully');

    // redirect back invoices page
    // router.push('/invoices');
    setIsUpdating(false); 
    
  };

  
  /**
   * Adds invoice data to the specified invoice document in the database.
   * 
   * @param data - The invoice data to be added.
   * @returns A Promise that resolves when the invoice data is successfully added.
   */
  const addInvoiceData = async (data: Inputs): Promise<void> => {
    await updateDoc(doc(db, `organizations/${organization!.id}/invoices/${params.id}`), {
      ...data,
    });
  }

  /**
   * Event handler for input blur.
   * 
   * @param event - The blur event object.
   */
  const handleInputBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    if (!form.formState.isValid) form.setValue('status', 'in progress');
    else form.setValue('status', 'completed');
    addInvoiceData(form.getValues());
  };


  const handleExport = () => {

    // export pdf and get data uri
    const pdfDataUri = exportPDF(form.getValues());

    // set form values to download link
    form.setValue('downloadLink', pdfDataUri);

    // update db
    addInvoiceData(form.getValues());

    // redirect back invoices page
    router.push('/invoices');

  }
  
  const deleteInvoice = async () => {
    await deleteDoc(doc(db, `organizations/${organization!.id}/invoices/${params.id}`));
    // router.push('/invoices');
  }

  return (
    <div className='flex flex-col relative pt-[60px] w-full h-screen p-5'>

      <div 
        className={`${isDeleting ? 'inline' : 'hidden'} absolute top-0 left-0 w-full h-full 
        bg-black bg-opacity-50 flex items-center justify-center`}
      >
        <div className='bg-white p-5 rounded-md space-y-5'>
          <p>Are you sure you want to delete this invoice?</p>
          <div className='flex space-x-3 items-center justify-center'>
            <Button 
              onClick={() => setIsDeleting(false)}
              variant={'secondary'}
            >
              Cancel
            </Button>
            <Button 
              variant='destructive'
              onClick={() => {
                  toast.promise(deleteInvoice(), {
                    loading: 'Deleting invoice...',
                    success: 'Invoice deleted!',
                    error: 'Failed to delete invoice',
                  });
                  router.push('/invoices');
                  setIsDeleting(false);
            }}>
              Delete
            </Button>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="flex flex-col space-y-8 bg-slate-100 p-3 rounded-md"
        >
          <div className='flex flex-col'>
            <div className='flex items-end space-x-3 justify-start'>
              <p className='font-black text-3xl'>Invoice</p>
              <p className='text-slate-600 text-3xl'> #{formValues?.invoiceNumber}</p>
            </div>
            {/* created by ... on date... */}
            <p className='text-xs text-slate-500'>Created by {formValues?.userId}</p>
          </div>
          <div>
            <StatusBar status={formValues?.status || 'in progress'}/>
          </div>
          {/* Buyer field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name of Buyer</FormLabel>
                <FormControl>
                  <Input placeholder="Type Name here..." {...field} onBlur={handleInputBlur}/>
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />
          {/* Bill to field */}
          <FormField
            control={form.control}
            name='billTo'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bill To</FormLabel>
                <FormControl>
                  <Input placeholder='Billing address' {...field} onBlur={handleInputBlur}/>
                </FormControl>
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />
          {/* ship to field */}
          <FormField
            control={form.control}
            name='shipTo'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ship To</FormLabel>
                <FormControl>
                  <Input placeholder='Shipping address' {...field} onBlur={handleInputBlur}/>
                </FormControl>
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />
          {/* send date field */}
          <FormField
            control={form.control}
            name='sendDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Date</FormLabel>
                <FormControl>
                  <Input type='date' {...field} onBlur={handleInputBlur}/>
                </FormControl>
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />     

          <div className='flex space-x-3'>

            <Button 
              type="submit"
              disabled={isUpdating || !form.formState.isValid}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Export
            </Button>
            <Button
              type='button'
              variant={'destructive'}
              onClick={() => {
                setIsDeleting(true);
              }}
            >
              <Trash />
            </Button>
          </div>
        </form>
      </Form>
   
    </div>
  )
}

export default page;