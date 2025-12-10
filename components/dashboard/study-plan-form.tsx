'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { studyPlanFormSchema, type StudyPlanFormValues } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const studyMethodsOptions = ["Practice Quizzes", "Reading Sections", "Flashcards", "Mind Mapping", "Group Study", "Videos"];

type StudyPlanFormProps = {
  formAction: (payload: any) => void;
  userId: string | undefined;
  isPending: boolean;
};

export function StudyPlanForm({ formAction, userId, isPending }: StudyPlanFormProps) {

  const form = useForm<StudyPlanFormValues>({
    resolver: zodResolver(studyPlanFormSchema),
    defaultValues: {
      subject: '',
      deadline: undefined,
      sections: [{ value: '' }],
      studyMethods: [],
      frequency: '3',
      duration: '60',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sections",
  });
  
  return (
    <Form {...form}>
      <form action={formAction} className="relative">
      <CardHeader>
        <CardTitle>Plan Details</CardTitle>
        <CardDescription>Provide the details for your upcoming exam.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Quantum Physics" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Hidden input to pass userId to the server action */}
        {userId && <input type="hidden" name="userId" value={userId} />}

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Exam Deadline</FormLabel>
              {/* This hidden input will pass the date to the server action */}
              <input type="hidden" name="deadline" value={field.value?.toISOString() ?? ''} />
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Study Frequency</FormLabel>
                <Select name={field.name} onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Times per week" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[...Array(7)].map((_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        {i + 1} time{i > 0 && 's'} per week
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Session Duration</FormLabel>
                 <Select name={field.name} onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Session length" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
            <FormLabel>Sections / Topics</FormLabel>
            <div className="space-y-2 mt-2">
            {fields.map((field, index) => (
                <FormField
                key={field.id}
                control={form.control}
                name={`sections.${index}.value`}
                render={({ field }) => (
                    <FormItem>
                    <div className="flex items-center gap-2">
                        <FormControl>
                          <Input placeholder={`Topic ${index + 1}`} {...field} name="sections" />
                        </FormControl>
                        {fields.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        )}
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
                />
            ))}
            </div>
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ value: "" })}
            >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Section
            </Button>
        </div>

        <FormField
          control={form.control}
          name="studyMethods"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Preferred Study Methods</FormLabel>
                <FormDescription>
                  Select the methods you'd like to use.
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {studyMethodsOptions.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="studyMethods"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              {...field}
                              name="studyMethods"
                              value={item}
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                const updatedValue = checked
                                  ? [...currentValue, item]
                                  : currentValue.filter(
                                      (value) => value !== item
                                    );
                                field.onChange(updatedValue);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isPending || !userId}>
          {isPending ? 'Generating...' : 'Generate Plan'}
        </Button>
      </CardFooter>
      </form>
    </Form>
  );
}
