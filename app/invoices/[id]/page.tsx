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


// Define the schema for the form
const invoiceSchema = z.object({
  name: z.string(),
  billTo: z.string(),
  shipTo: z.string(),
  sendDate: z.string(),
  userId: z.string(),
});
type Inputs = z.infer<typeof invoiceSchema>;



function page( { params } : {params: {id: string}} ) {

  const { organization } = useOrganization();
  const [ initialValues, setInitialValues ] = useState<Inputs | null>(null);
  const [ isUpdating, setIsUpdating ] = useState(false);


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

    const data = docs?.docs[0]?.data() as Inputs;
    // console.log(data);
    setInitialValues(data);
    console.log(data);

    form.reset(data); // Reset the form with fetched data
  }, [docs, form]);

  // form action
  const onSubmit: SubmitHandler<Inputs> = async data => {
    // console.log(data);
    setIsUpdating(true);
    // send data to database
    toast.promise(addInvoiceData(data), {
      loading: 'Updating...',
      success: 'Invoice updated successfully',
      error: 'Failed to update invoice',
    });
    // await addInvoiceData(data);

    setIsUpdating(false);
  };

  const addInvoiceData = async (data: Inputs) => {
    await updateDoc(doc(db, `organizations/${organization!.id}/invoices/${params.id}`), {
      ...data,
    });
  }

  return (
    <div className='flex flex-col relative top-[60px] w-full h-screen p-5'>

      <Form {...form} >
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
          {/* Buyer field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name of Buyer</FormLabel>
                <FormControl>
                  <Input placeholder="Type Name here..." {...field} />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
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
                  <Input placeholder='Billing address' {...field} />
                </FormControl>
                <FormMessage />
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
                  <Input placeholder='Shipping address' {...field} />
                </FormControl>
                <FormMessage />
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
                  <Input type='date' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />     


          <Button 
            type="submit"
            disabled={isUpdating}
          >
            Update
          </Button>
        </form>
      </Form>
   
    </div>
  )
}

export default page;