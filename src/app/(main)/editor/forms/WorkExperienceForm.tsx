"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { EditorFormProps } from "@/lib/types"
import { workExperienceSchema, WorkExperienceValues } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { GripHorizontal } from "lucide-react"
import { useEffect } from "react"
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form"
import { DndContext, DragEndEvent, useDraggable, useSensors, useSensor, KeyboardSensor, PointerSensor, closestCenter } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";


const WorkExperienceForm = ({ resumeData, setResumeData }: EditorFormProps) => {
    const form = useForm<WorkExperienceValues>({
        resolver: zodResolver(workExperienceSchema),
        defaultValues: {
            workExperiences: resumeData.workExperiences || []
        }
    });

    useEffect(() => {
        const { unsubscribe } = form.watch(async (values) => {
            const isValid = await form.trigger();
            if (!isValid) return
            setResumeData({ ...resumeData, workExperiences: values.workExperiences?.filter(exp => exp !== undefined) || [] })
        });
        return unsubscribe;
    }, [form, resumeData, setResumeData])

    const { fields, append, remove, move } = useFieldArray({
        control: form.control,
        name: "workExperiences"
    });
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (active.id !== over?.id) {
            const oldIndex = fields.findIndex(field => field.id === active.id);
            const newIndex = fields.findIndex(field => field.id === over?.id);

            move(oldIndex, newIndex)

            return arrayMove(fields, oldIndex, newIndex)

        }


    }
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );
    return (
        <div className="mx-auto max-w-xl space-y-6">
            <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-semibold">
                    Work Experiance
                </h2>
                <p className="text-muted-foreground text-sm">
                    Add as many work experiance as you like
                </p>
            </div>
            <Form {...form}>
                <form className="space-y-3">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                    >
                        <SortableContext items={fields.map(field => field.id)} strategy={verticalListSortingStrategy}>
                            {fields.map((field, index) => (



                                <WorkExperienceItem
                                    id={field.id}
                                    form={form}
                                    key={field.id}
                                    index={index}
                                    remove={remove}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                    <div>
                        <Button
                            type="button"
                            onClick={() => append({
                                company: "",
                                position: "",
                                description: "",
                                startDate: "",
                                endDate: ""
                            })}
                        >
                            Add Work Experiance
                        </Button></div>
                </form>
            </Form>
        </div>
    )
}
interface WorkExperienceProps {
    id: string
    form: UseFormReturn<WorkExperienceValues>;
    index: number;
    remove: (index: number) => void
}
function WorkExperienceItem({
    id,
    form,
    index,
    remove
}: WorkExperienceProps) {
    const { listeners, transform, transition, attributes, setNodeRef, isDragging } = useSortable({
        id
    });
    return (
        <div
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            className={cn("space-y-6 w-full p-3 rounded-md bg-background ", isDragging && "shadow-lg cursor-grabbing z-50 relative")}
            ref={setNodeRef}
        >
            <div className={cn("flex items-center justify-between max-w-3xl")}>
                <span className="font-semibold">Work experience {index + 1}</span>
                <GripHorizontal className="outline-none" {...attributes} {...listeners} />
            </div>
            <div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name={`workExperiences.${index}.position`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Job title</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`workExperiences.${index}.company`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`workExperiences.${index}.startDate`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        {...field}
                                        value={field.value?.slice(0, 10)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`workExperiences.${index}.endDate`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        {...field}
                                        value={field.value?.slice(0, 10)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                    <FormDescription>
                        Leave <span className="font-semibold">end date</span> empty if you are
                        currently working here.
                    </FormDescription>
                </div>
                <FormField
                    control={form.control}
                    name={`workExperiences.${index}.description`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />
            </div>
            <Button type="button" variant="destructive" onClick={() => remove(index)}>Remove</Button>

        </div>
    )
}
export default WorkExperienceForm