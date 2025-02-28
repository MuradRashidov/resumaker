import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import useDebounce from "@/hooks/useDebounce";
import { saveResume } from "@/lib/actions";
import { fileReplacer } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { set } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function useAutoSaveResume(resumeData: ResumeValues) {  
  const searchParams = useSearchParams();
  const debouncedResumeData = useDebounce(resumeData, 1500);
  const [resumeId,setResumeId] = useState(resumeData.id);
  const {toast} = useToast();

  const [lastSavedData, setLastSavedData] = useState(
    structuredClone(resumeData),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(false); 
  
  useEffect(() => {
    setError(false);
  },[debouncedResumeData])
  useEffect(() => {
    async function save() {        
      try {
        setIsSaving(true);
        setError(false);
        const newData = structuredClone(debouncedResumeData);

        const updatedData = await saveResume({
          ...newData,
          id: resumeId,
          ...(JSON.stringify(lastSavedData.photo,fileReplacer) === JSON.stringify(newData.photo,fileReplacer) && {photo: undefined}),
        });
        setResumeId(updatedData?.id);
        setLastSavedData(newData);

        if(searchParams.get("resumeId") !== updatedData?.id){
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("resumeId", updatedData?.id as string);
          window.history.replaceState(null, "", `?${newSearchParams.toString()}`);
        }
        
      } catch (error) {
        setError(true);
        const {dismiss} = toast({
          variant: "destructive",
          description: (
            <div>
              <p className="space-y-3">Could not save changes</p>
              <Button onClick={() => {
                dismiss();
                save();
              }}>Retry</Button>
            </div>
          ),
        });
        console.error(error);
        
      } finally {
        setIsSaving(false);
      }
    }

    const hasUnsavedChanges =
      JSON.stringify(debouncedResumeData,fileReplacer) !==
      JSON.stringify(lastSavedData,fileReplacer);

    if (hasUnsavedChanges && debouncedResumeData && !isSaving && !error) {
      save();
    }
  }, [
    debouncedResumeData,
    isSaving,
    lastSavedData,
    resumeId,
    error
  ]);

  return {
    isSaving,
    hasUnsavedChanges:
      JSON.stringify(resumeData) !== JSON.stringify(lastSavedData),
  };
}