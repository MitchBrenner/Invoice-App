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
import { Timestamp, collection, doc, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '@/firebase';
import { useOrganization } from '@clerk/nextjs';
import { useCollection } from 'react-firebase-hooks/firestore';
import toast from 'react-hot-toast';
import StatusBar from '@/components/StatusBar';
import { useRouter } from 'next/navigation';


// Define the schema for the form
const invoiceSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(1).max(100), // min 3 and max 100 chars
  billTo: z.string({ required_error: 'Bill to is required' }).min(1).max(100),
  shipTo: z.string({ required_error: 'Ship to is required' }).min(1).max(100),
  sendDate: z.string({ required_error: 'Send date is required' }).min(1).max(100),
  userId: z.string(),
  status: z.string(),
});
type Inputs = z.infer<typeof invoiceSchema>;



function page( { params } : {params: {id: string}} ) {

  const { organization } = useOrganization();
  const [ initialValues, setInitialValues ] = useState<Inputs | null>(null);
  const [ isUpdating, setIsUpdating ] = useState(false);
  const router = useRouter();

  // get data from database
  const [docs, loading, error] = useCollection(
    organization && query(
      collection(db, `organizations/${organization!.id}/invoices`),
      where("id", "==", params.id)
    )
  )
  
  // initialize form
  const form = useForm<Inputs>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      name: initialValues?.name === "Untitled Name" ? '' : initialValues?.name || '',
      billTo: initialValues?.billTo || '',
      shipTo: initialValues?.shipTo || '',
      sendDate: initialValues?.sendDate || '',
    },
  });


  useEffect(() => {
    if (!docs || !docs.docs[0]?.data) return;

    if (!form.formState.isValid) form.setValue('status', 'in progress');

    // set initial values
    const data = docs?.docs[0]?.data() as Inputs;
    // console.log(data);
    setInitialValues(data);
    console.log(data);

    form.reset(data); // Reset the form with fetched data

  }, [docs, form]);

  
  // form action on submit
  const onSubmit: SubmitHandler<Inputs> = async data => {
    // console.log(data);
    setIsUpdating(true);
    // send data to database

    form.setValue('status', 'completed');
    data.status = form.getValues().status;

    toast.promise(addInvoiceData(data), {
      loading: 'Updating...',
      success: 'Invoice updated successfully',
      error: 'Failed to update invoice',
    });
    // await addInvoiceData(data);

    router.push('/invoices');

    setIsUpdating(false);
  };

  const addInvoiceData = async (data: Inputs) => {
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
  

  return (
    <div className='flex flex-col relative top-[60px] w-full h-screen p-5'>

      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="flex flex-col space-y-8 bg-slate-100 p-3 rounded-md"
        >
          <div>
            <p className='font-black text-3xl'>Invoice</p>
            <p className='text-sm text-slate-600'> #{params.id}</p>
            {/* created by ... on date... */}
            <p className='text-xs text-slate-600'>Created by {initialValues?.userId}</p>
          </div>
          <div>
            <StatusBar status={initialValues?.status || 'in progress'}/>
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


          <Button 
            type="submit"
            disabled={isUpdating || !form.formState.isValid}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Complete
          </Button>
        </form>
      </Form>
   
    </div>
  )
}

export default page;