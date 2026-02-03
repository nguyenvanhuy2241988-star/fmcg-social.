'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getJobs() {
    const supabase = await createClient();

    const { data: jobs, error } = await supabase
        .from('jobs')
        .select(`
            *,
            recruiter:recruiter_id (
                full_name,
                avatar_url,
                headline
            )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching jobs:", error);
        return [];
    }

    return jobs || [];
}

export async function createJob(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const title = formData.get('title') as string;
    const company_name = formData.get('company_name') as string;
    const location = formData.get('location') as string;
    const salary_range = formData.get('salary_range') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;

    const { error } = await supabase
        .from('jobs')
        .insert({
            recruiter_id: user.id,
            title,
            company_name,
            location,
            salary_range,
            description,
            category,
            status: 'active'
        });

    if (error) {
        console.error("Error creating job:", error);
        return { error: "Failed to create job" };
    }

    revalidatePath('/jobs');
    redirect('/jobs');
}
