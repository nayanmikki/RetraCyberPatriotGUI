'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Trash2, 
  FileSearch, 
  Image as ImageIcon,
  Network,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

export default function ForensicsView() {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [backdoorPath, setBackdoorPath] = useState('/usr/share/zod/kneelB4zod.py');
  const [pcapFile, setPcapFile] = useState('');
  const [tcpStream, setTcpStream] = useState('0');
  const [pcapOutput, setPcapOutput] = useState('');
  const [stegoImage, setStegoImage] = useState('');
  const [stegoPass, setStegoPass] = useState('');
  const [stegoOutput, setStegoOutput] = useState('');

  const scanServices = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/forensics/scan-services');
      const data = await response.json();
      
      if (data.success) {
        setServices(data.services || []);
      } else {
        alert(`Failed to scan services: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const killProcess = async (pid: number) => {
    if (!confirm(`Kill process ${pid}?`)) return;
    
    try {
      const response = await fetch('/api/forensics/kill-process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pid }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Process killed successfully');
        scanServices();
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const detectBackdoor = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/forensics/detect-backdoor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: backdoorPath }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`Backdoor scan complete:\n${data.output}`);
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const terminateBackdoor = async () => {
    if (!confirm(`Terminate all processes matching: ${backdoorPath}?`)) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/forensics/terminate-backdoor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: backdoorPath }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Backdoor processes terminated');
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteBackdoor = async () => {
    if (!confirm(`Delete file: ${backdoorPath}?\n\nThis action cannot be undone!`)) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/forensics/delete-backdoor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: backdoorPath }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Backdoor file deleted');
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const analyzePcap = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/forensics/analyze-pcap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: pcapFile, stream: tcpStream }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPcapOutput(data.output || 'No output');
      } else {
        setPcapOutput(`Error: ${data.error}`);
      }
    } catch (error: any) {
      setPcapOutput(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const extractStego = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/forensics/extract-stego', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: stegoImage, passphrase: stegoPass }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStegoOutput(`Extracted message:\n${data.message}\n\nMD5: ${data.md5}`);
      } else {
        setStegoOutput(`Error: ${data.error}`);
      }
    } catch (error: any) {
      setStegoOutput(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-1">Forensics</h2>
            <p className="text-sm text-muted-foreground">Investigate system activity and detect threats</p>
          </div>

          <Tabs defaultValue="services" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="backdoor">Backdoors</TabsTrigger>
              <TabsTrigger value="pcap">PCAP Analysis</TabsTrigger>
              <TabsTrigger value="stego">Steganography</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Running Services & Processes</h3>
                  <Button onClick={scanServices} disabled={loading} className="gap-2">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    Scan Services
                  </Button>
                </div>
                
                <ScrollArea className="h-96">
                  {services.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Network className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No services scanned yet. Click "Scan Services" to begin.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {services.map((service, idx) => (
                        <div key={idx} className="p-3 rounded-md bg-accent/50 flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{service.pid}</Badge>
                              <span className="text-sm font-medium">{service.user}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 font-mono">{service.command}</p>
                            {service.port && (
                              <p className="text-xs text-muted-foreground mt-1">Port: {service.port}</p>
                            )}
                          </div>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => killProcess(service.pid)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </Card>
            </TabsContent>

            <TabsContent value="backdoor" className="space-y-4">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Detect & Remove Backdoors</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="backdoor-path">Backdoor File Path</Label>
                    <Input
                      id="backdoor-path"
                      value={backdoorPath}
                      onChange={(e) => setBackdoorPath(e.target.value)}
                      placeholder="/usr/share/zod/kneelB4zod.py"
                      className="mt-1"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={detectBackdoor} disabled={loading} className="gap-2">
                      <FileSearch className="h-4 w-4" />
                      Detect
                    </Button>
                    <Button onClick={terminateBackdoor} disabled={loading} variant="outline" className="gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Terminate Process
                    </Button>
                    <Button onClick={deleteBackdoor} disabled={loading} variant="destructive" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete File
                    </Button>
                  </div>

                  <div className="p-4 rounded-md bg-muted">
                    <p className="text-xs text-muted-foreground">
                      <strong>Note:</strong> This will search for the specified file and running processes.
                      Terminate will use <code>pkill -f</code> and Delete will use <code>rm -f</code>.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="pcap" className="space-y-4">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">PCAP File Analysis</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pcap-file">PCAP File Path</Label>
                    <Input
                      id="pcap-file"
                      value={pcapFile}
                      onChange={(e) => setPcapFile(e.target.value)}
                      placeholder="/path/to/capture.pcap"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tcp-stream">TCP Stream Number</Label>
                    <Input
                      id="tcp-stream"
                      type="number"
                      value={tcpStream}
                      onChange={(e) => setTcpStream(e.target.value)}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>

                  <Button onClick={analyzePcap} disabled={loading} className="gap-2">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Network className="h-4 w-4" />}
                    Analyze PCAP
                  </Button>

                  {pcapOutput && (
                    <div className="p-4 rounded-md bg-muted">
                      <pre className="text-xs whitespace-pre-wrap font-mono">{pcapOutput}</pre>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="stego" className="space-y-4">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Steganography Decoder</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="stego-image">Image File Path</Label>
                    <Input
                      id="stego-image"
                      value={stegoImage}
                      onChange={(e) => setStegoImage(e.target.value)}
                      placeholder="/path/to/image.jpg"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stego-pass">Passphrase</Label>
                    <Input
                      id="stego-pass"
                      type="password"
                      value={stegoPass}
                      onChange={(e) => setStegoPass(e.target.value)}
                      placeholder="Enter passphrase"
                      className="mt-1"
                    />
                  </div>

                  <Button onClick={extractStego} disabled={loading} className="gap-2">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                    Extract & Hash
                  </Button>

                  {stegoOutput && (
                    <div className="p-4 rounded-md bg-muted">
                      <pre className="text-xs whitespace-pre-wrap font-mono">{stegoOutput}</pre>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="w-96 border-l border-border p-6 overflow-y-auto bg-card/30">
        <h3 className="text-lg font-semibold mb-4">Results & Output</h3>
        <div className="space-y-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">
              Forensics results will appear here after running scans and analyses.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

