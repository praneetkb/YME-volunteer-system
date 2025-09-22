// supabase connection code

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nuwxhczxybcypqosphjv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51d3hoY3p4eWJjeXBxb3NwaGp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MjAwNTEsImV4cCI6MjA3MzM5NjA1MX0.CUPXnsjsI2YDFG-IfVY6w6QArcc44NCApkW8t56boOI'
export const supabase = createClient(supabaseUrl, supabaseKey)
