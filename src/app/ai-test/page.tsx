'use client';

import {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Loader2} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AiTestPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [formData, setFormData] = useState({
    subject: 'History',
    deadline: '2024-12-31',
    sections: 'The Great War, The Cold War',
    studyMethods: 'Flashcards, Practice Quizzes',
    define: 'hegemony',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch AI response');
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            AI-Powered Study Planner
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Fill in the form below to get personalized study tips from our AI assistant.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Your Study Plan</CardTitle>
            <CardDescription>Tell us what you're studying, and we'll generate a plan for you.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" value={formData.subject} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" name="deadline" type="date" value={formData.deadline} onChange={handleInputChange} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="sections">Sections to Cover</Label>
                <Input id="sections" name="sections" value={formData.sections} onChange={handleInputChange} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="studyMethods">Preferred Study Methods</Label>
                <Input id="studyMethods" name="studyMethods" value={formData.studyMethods} onChange={handleInputChange} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="define">Define a Word (optional)</Label>
                <Input id="define" name="define" value={formData.define} onChange={handleInputChange} />
              </div>
              <div className="md:col-span-2 text-center">
                <Button type="submit" disabled={loading} className="w-full md:w-auto">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? 'Generating...' : 'Get Study Tips'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Card className="max-w-2xl mx-auto mt-8 bg-red-50 border-red-500 text-red-900 shadow-lg">
            <CardHeader>
              <CardTitle>An Error Occurred</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
            </CardContent>
          </Card>
        )}

        {response && (
          <Card className="max-w-2xl mx-auto mt-8 shadow-lg">
            <CardHeader>
              <CardTitle>Your Personalized Study Plan</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h2>Study Plan</h2>
              <p>{response.planSummary}</p>
              <h3>Tasks</h3>
              <ul>
                {response.tasks.map((task: any, index: number) => (
                  <li key={index}>
                    <strong>{task.title}</strong> - {task.priority} priority - {task.estimatedMinutes} minutes
                  </li>
                ))}
              </ul>
              <h3>Notes</h3>
              <p>{response.notes}</p>
              
              {response.dictionaryDefinition && (
                <>
                  <h3>Dictionary Definition</h3>
                  {response.dictionaryDefinition.error ? (
                    <p>{response.dictionaryDefinition.error}</p>
                  ) : (
                    <div>
                      {response.dictionaryDefinition.map((def: any, index: number) => (
                        <div key={index}>
                          <h4>{def.word}</h4>
                          {def.meanings.map((meaning: any, i: number) => (
                            <div key={i}>
                              <h5>{meaning.partOfSpeech}</h5>
                              <ul>
                                {meaning.definitions.map((d: any, j: number) => (
                                  <li key={j}>{d.definition}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
