"use client"
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { EditorFormProps } from '@/lib/types';
import { personalInfoSchema, PersonalInfoTypes } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';


export const PersonalInfoForm = ({ resumeData, setResumeData }: EditorFormProps) => {
    const form = useForm<PersonalInfoTypes>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            city: resumeData.city || "",
            country: resumeData.country || "",
            firstName: resumeData.firstName || "",
            lastName: resumeData.lastName || "",
            jobTitle: resumeData.jobTitle || "",
            phone: resumeData.phone || "",
            email: resumeData.email || ""
        }
    });
    useEffect(() => {
        const { unsubscribe } = form.watch(async (values) => {
            const isValid = await form.trigger();
            if (!isValid) return
            setResumeData({ ...resumeData, ...values })
        });
        return unsubscribe;
    }, [form, resumeData, setResumeData]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div className="text-center space-y-1.5">
                <div className="font-semibold text-2xl">Personal Info</div>
                <p className="text-sm text-muted-foreground">Tell us about yourself</p>
            </div>
            <Form {...form}>
                <form>
                    <FormField
                        control={form.control}
                        name="photo"
                        render={({ field: { value, ...fieldValues } }) => (
                            <FormItem>
                                <FormLabel>Your photo</FormLabel>
                                <div className="flex items-center space-x-3 py-2">
                                <FormControl>
                                    <Input
                                        {...fieldValues}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            console.log("Form: ", form);

                                            const file = e.target.files?.[0]
                                            fieldValues.onChange(file)
                                        }}
                                        ref={fileInputRef}

                                    />
                                </FormControl>
                                
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onClick={() => {
                                            fieldValues.onChange(null);
                                            if (fileInputRef.current) fileInputRef.current.value = "";
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="jobTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input type="tel" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    );
};