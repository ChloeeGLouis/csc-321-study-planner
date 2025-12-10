
import {NextRequest, NextResponse} from 'next/server';
import {provideAiStudyTips, StudyTipsInput} from '@/ai/flows/provide-ai-study-tips';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as StudyTipsInput;
    const studyTips = await provideAiStudyTips(body);
    return NextResponse.json(studyTips);
  } catch (e) {
    console.error(e);
    return NextResponse.json({error: 'Failed to generate study tips'}, {status: 500});
  }
}
