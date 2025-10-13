import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

await supabaseAdmin.from('responses').insert([{
    session_date: '2025-09-21',
    facilitator_name: 'Praneet Kaur',
    students_name: 'Isabel, Denise',
    student_absent: 'Denise',
    topic: 'Halloween',
    session_summary: 'Engaged and participated alot',
    tech_issues: 'No issues',
    student_struggles: 'Punctuation',
    student_strengths: 'Read paragraph fluently',
    strategies_used: 'Storytelling',
    next_session_notes: 'Give more visuals'
  }]);
  
  const { data } = await supabaseAdmin
  .from('responses')
  .select('*')
  .eq('status', 'completed')
  .order('session_date', { ascending: false })
  .limit(5);
