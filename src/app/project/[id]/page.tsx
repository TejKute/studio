'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Bot, Loader2, Wand2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/components/layout/app-layout';
import { PhonePreview } from '@/components/phone-preview';
import { CodeBlock } from '@/components/code-block';
import { useToast } from '@/hooks/use-toast';

const MOCK_FLUTTER_CODE = `import 'package:flutter/material.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Craftify AI App',
      theme: ThemeData(
        primarySwatch: Colors.deepPurple,
        useMaterial3: true,
      ),
      home: const MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Craftify AI Generated'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'You have pushed the button this many times:',
            ),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}
`;

const MOCK_THEME_CODE = `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

ThemeData createTheme() {
  return ThemeData(
    primaryColor: const Color(0xFF3F51B5), // Deep Blue
    scaffoldBackgroundColor: const Color(0xFFF5F5F5), // Light Gray
    colorScheme: ColorScheme.fromSwatch().copyWith(
      secondary: const Color(0xFF7E57C2), // Purple
    ),
    textTheme: GoogleFonts.interTextTheme(),
    appBarTheme: AppBarTheme(
      titleTextStyle: GoogleFonts.spaceGrotesk(
        fontSize: 20,
        fontWeight: FontWeight.bold,
      ),
    ),
    fontFamily: GoogleFonts.sourceCodePro().fontFamily,
  );
}
`;

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [appDescription, setAppDescription] = useState('');
  const [themeDescription, setThemeDescription] = useState('');
  const [generatedAppCode, setGeneratedAppCode] = useState('');
  const [generatedThemeCode, setGeneratedThemeCode] = useState('');
  const [isGeneratingApp, setIsGeneratingApp] = useState(false);
  const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);
  const { toast } = useToast();

  const handleGenerateApp = async () => {
    if (!appDescription) {
        toast({
            variant: "destructive",
            title: "Description is empty",
            description: "Please provide a description for your app.",
        });
        return;
    }
    setIsGeneratingApp(true);
    setGeneratedAppCode('');
    // Mock AI call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGeneratedAppCode(MOCK_FLUTTER_CODE);
    setIsGeneratingApp(false);
  };

  const handleGenerateTheme = async () => {
    if (!themeDescription) {
        toast({
            variant: "destructive",
            title: "Theme description is empty",
            description: "Please provide a description for your theme.",
        });
        return;
    }
    setIsGeneratingTheme(true);
    setGeneratedThemeCode('');
    // Mock AI call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setGeneratedThemeCode(MOCK_THEME_CODE);
    setIsGeneratingTheme(false);
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-headline font-bold">App Builder</h1>
            <p className="text-muted-foreground">Generate your Flutter app from a text description.</p>
          </div>
          <Button disabled={!generatedAppCode}>
            <Download className="mr-2 h-4 w-4" />
            Export Code
          </Button>
        </div>
        <Separator />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel: Inputs */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Label htmlFor="app-description" className="text-lg font-semibold font-headline flex items-center">
                    <Bot className="mr-2 h-5 w-5" /> App Description
                  </Label>
                  <Textarea
                    id="app-description"
                    placeholder="Describe your app's features, layout, and functionality. For example: 'A simple counter app with a plus button to increment a number displayed on screen...'"
                    className="min-h-[200px]"
                    value={appDescription}
                    onChange={(e) => setAppDescription(e.target.value)}
                  />
                </div>
                <Button onClick={handleGenerateApp} disabled={isGeneratingApp} className="mt-4 w-full">
                  {isGeneratingApp ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  Generate App
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                 <div className="space-y-2">
                  <Label htmlFor="theme-description" className="text-lg font-semibold font-headline flex items-center">
                    <Wand2 className="mr-2 h-5 w-5" /> Theme Description
                  </Label>
                  <Textarea
                    id="theme-description"
                    placeholder="Describe your app's color scheme, fonts, and overall style. For example: 'A dark theme with a deep blue primary color and bright green accents...'"
                    className="min-h-[120px]"
                    value={themeDescription}
                    onChange={(e) => setThemeDescription(e.target.value)}
                  />
                </div>
                <Button onClick={handleGenerateTheme} disabled={isGeneratingTheme} className="mt-4 w-full" variant="secondary">
                  {isGeneratingTheme ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  Generate Theme
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel: Outputs */}
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="app_code">App Code</TabsTrigger>
              <TabsTrigger value="theme_code">Theme Code</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="mt-4">
              <Card className="h-[650px] flex items-center justify-center p-4">
                <PhonePreview>
                  <div className="bg-slate-50 h-full p-4">
                     <h2 className="font-bold text-lg mb-2">My App</h2>
                     <p className="text-sm text-gray-600 mb-4">This is a preview of the UI.</p>
                     <div className="space-y-4">
                       <div className="w-full h-24 bg-blue-200 rounded-lg flex items-center justify-center text-blue-800">Header</div>
                       <div className="w-full h-40 bg-purple-200 rounded-lg flex items-center justify-center text-purple-800">Content Area</div>
                       <div className="flex gap-4">
                         <Button className="flex-1">Button 1</Button>
                         <Button variant="secondary" className="flex-1">Button 2</Button>
                       </div>
                     </div>
                  </div>
                </PhonePreview>
              </Card>
            </TabsContent>
            <TabsContent value="app_code" className="mt-4">
               <Card className="h-[650px] overflow-hidden">
                {isGeneratingApp ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin mb-4" />
                        <p className="font-semibold">Generating App Code...</p>
                        <p className="text-sm">Please wait a moment.</p>
                    </div>
                ) : generatedAppCode ? (
                    <CodeBlock code={generatedAppCode} language="dart" className="h-full" />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <Bot className="h-10 w-10 mb-4" />
                        <p className="font-semibold">Your generated app code will appear here.</p>
                    </div>
                )}
               </Card>
            </TabsContent>
            <TabsContent value="theme_code" className="mt-4">
                <Card className="h-[650px] overflow-hidden">
                {isGeneratingTheme ? (
                     <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin mb-4" />
                        <p className="font-semibold">Generating Theme Code...</p>
                        <p className="text-sm">Please wait a moment.</p>
                    </div>
                ) : generatedThemeCode ? (
                    <CodeBlock code={generatedThemeCode} language="dart" className="h-full" />
                ) : (
                     <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <Wand2 className="h-10 w-10 mb-4" />
                        <p className="font-semibold">Your generated theme code will appear here.</p>
                    </div>
                )}
               </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
