'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Trash2, 
  Loader2,
  RefreshCw,
  Package,
  FileAudio,
  AlertCircle
} from 'lucide-react';

export default function CleanupView() {
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  const runSystemUpdate = async () => {
    if (!confirm('Run system update?\n\nThis will run: sudo apt update && sudo apt full-upgrade -y\n\nThis may take several minutes.')) {
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch('/api/cleanup/system-update', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        alert(`System update completed!\n\n${data.output}`);
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const scanMediaFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cleanup/scan-media');
      const data = await response.json();

      if (data.success) {
        setMediaFiles(data.files || []);
        setSelectedFiles(new Set());
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteSelectedFiles = async () => {
    if (selectedFiles.size === 0) {
      alert('No files selected');
      return;
    }

    if (!confirm(`Delete ${selectedFiles.size} file(s)?\n\nThis action cannot be undone!`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/cleanup/delete-files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: Array.from(selectedFiles) }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`${selectedFiles.size} file(s) deleted successfully`);
        scanMediaFiles();
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const removeUnauthorizedSoftware = async () => {
    if (!confirm('Remove unauthorized software?\n\nThis will:\n- Delete /usr/games/pyrdp-master.zip\n- Purge doona and xprobe packages\n\nContinue?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/cleanup/remove-software', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        alert('Unauthorized software removed successfully');
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleFileSelection = (file: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(file)) {
      newSelected.delete(file);
    } else {
      newSelected.add(file);
    }
    setSelectedFiles(newSelected);
  };

  const selectAll = () => {
    setSelectedFiles(new Set(mediaFiles));
  };

  const deselectAll = () => {
    setSelectedFiles(new Set());
  };

  return (
    <div className="h-full flex">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-1">Cleanup & Updates</h2>
            <p className="text-sm text-muted-foreground">System updates, media cleanup, and software removal</p>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              System Updates
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-md bg-accent/50">
                <p className="text-sm mb-3">
                  Update all system packages to the latest versions. This may take several minutes.
                </p>
                <Button onClick={runSystemUpdate} disabled={updating} className="gap-2">
                  {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  {updating ? 'Updating...' : 'Run System Update'}
                </Button>
              </div>

              <div className="p-3 rounded-md bg-muted text-xs text-muted-foreground">
                <p className="font-medium mb-1">Command:</p>
                <code>sudo apt update && sudo apt full-upgrade -y</code>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileAudio className="h-5 w-5" />
              Media File Cleanup
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button onClick={scanMediaFiles} disabled={loading} className="gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileAudio className="h-4 w-4" />}
                  Scan for .ogg Files
                </Button>
                {mediaFiles.length > 0 && (
                  <>
                    <Button onClick={selectAll} variant="outline" size="sm">
                      Select All
                    </Button>
                    <Button onClick={deselectAll} variant="outline" size="sm">
                      Deselect All
                    </Button>
                    <Button 
                      onClick={deleteSelectedFiles} 
                      disabled={loading || selectedFiles.size === 0}
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete Selected ({selectedFiles.size})
                    </Button>
                  </>
                )}
              </div>

              <ScrollArea className="h-64 rounded-md border border-border p-3">
                {mediaFiles.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileAudio className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No media files scanned yet. Click "Scan for .ogg Files" to begin.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {mediaFiles.map((file) => (
                      <div key={file} className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/50">
                        <Checkbox
                          checked={selectedFiles.has(file)}
                          onCheckedChange={() => toggleFileSelection(file)}
                        />
                        <span className="text-xs font-mono flex-1">{file}</span>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              <div className="p-3 rounded-md bg-muted text-xs text-muted-foreground">
                <p className="font-medium mb-1">Commands:</p>
                <code>sudo locate '*.ogg' && sudo find /home -type f -name '*.ogg'</code>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Unauthorized Software Removal
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-md bg-destructive/10 border border-destructive/20">
                <div className="flex items-start gap-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <strong>Warning:</strong> This will permanently remove unauthorized software and archives.
                  </div>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1 mb-3 ml-6">
                  <li>• Delete: /usr/games/pyrdp-master.zip</li>
                  <li>• Purge: doona</li>
                  <li>• Purge: xprobe</li>
                </ul>
                <Button onClick={removeUnauthorizedSoftware} disabled={loading} variant="destructive" className="gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  Remove Unauthorized Software
                </Button>
              </div>

              <div className="p-3 rounded-md bg-muted text-xs text-muted-foreground">
                <p className="font-medium mb-1">Commands:</p>
                <code>sudo rm /usr/games/pyrdp-master.zip<br/>sudo apt purge -y doona xprobe</code>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="w-96 border-l border-border p-6 overflow-y-auto bg-card/30">
        <h3 className="text-lg font-semibold mb-4">Cleanup Info</h3>
        
        <div className="space-y-4">
          <Card className="p-4">
            <h4 className="font-medium mb-2 text-sm">Update Process</h4>
            <p className="text-xs text-muted-foreground">
              System updates refresh package lists and upgrade all installed packages to their latest versions. Config file decisions use safe defaults.
            </p>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-2 text-sm">Media Scan</h4>
            <p className="text-xs text-muted-foreground">
              Scans for .ogg audio files in /home directories and system-wide using locate and find commands.
            </p>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-2 text-sm">Software Removal</h4>
            <p className="text-xs text-muted-foreground">
              Removes known unauthorized tools and archives that may cause scoring penalties. Always verify before removal.
            </p>
          </Card>

          <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
            <h4 className="font-medium mb-2 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
              Important
            </h4>
            <p className="text-xs text-muted-foreground">
              Do not delete files under public FTP paths flagged as "critical" to avoid penalties.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

