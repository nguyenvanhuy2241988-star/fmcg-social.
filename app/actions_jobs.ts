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

export async function createJob(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Bạn cần đăng nhập để thực hiện thao tác này." };

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
        return { error: "Có lỗi xảy ra khi tạo tin tuyển dụng. Vui lòng thử lại." };
    }

    revalidatePath('/jobs');
    redirect('/jobs');
}

export async function applyForJob(jobId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "User not logged in" };

    const { error } = await supabase
        .from('job_applications')
        .insert({
            job_id: jobId,
            applicant_id: user.id,
            status: 'pending'
        });

    if (error) {
        // Handle duplicate application or other errors
        console.error("Application error:", error);
        return { error: "Failed to apply" };
    }

    // Notify Recruiter
    // Fetch job details to get recruiter_id
    const { data: job } = await supabase.from('jobs').select('recruiter_id, title').eq('id', jobId).single();
    if (job && job.recruiter_id !== user.id) {
        const { createNotification } = await import('./actions_notifications');
        await createNotification(job.recruiter_id, 'job_application', jobId); // New notification type: job_application
    }

    revalidatePath(`/jobs/${jobId}`);
}

export async function getJobApplications(jobId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // Verify if user is the recruiter for this job
    const { data: job } = await supabase
        .from('jobs')
        .select('recruiter_id')
        .eq('id', jobId)
        .single();

    if (!job || job.recruiter_id !== user.id) return [];

    const { data: applications, error } = await supabase
        .from('job_applications')
        .select(`
            *,
            applicant:applicant_id (
                id,
                full_name,
                avatar_url,
                headline
            )
        `)
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching applications:", error);
        return [];
    }

    return applications || [];
}
