
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { createInfluencerFromURL } from "@/lib/sheetParser";
import { Influencer } from "@/types";

interface ManualInfluencerInputProps {
  onAdd: (influencer: Influencer) => void;
}

export function ManualInfluencerInput({ onAdd }: ManualInfluencerInputProps) {
  const { toast } = useToast();
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const influencer = createInfluencerFromURL(url);
      if (influencer) {
        onAdd(influencer);
        setUrl("");
        toast({
          title: "Success",
          description: "Influencer added successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Invalid URL. Please enter an Instagram or YouTube profile URL",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding influencer:", error);
      toast({
        title: "Error",
        description: "Failed to add influencer",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Instagram or YouTube profile URL"
          className="flex-1"
        />
        <Button type="submit">Add</Button>
      </form>
    </Card>
  );
}
