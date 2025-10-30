import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile, writeFile, copyFile } from 'fs/promises';

const execAsync = promisify(exec);

export async function createBackup(filePath: string): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T').join('-').substring(0, 19);
  const backupPath = `${filePath}.backup-${timestamp}`;
  
  try {
    await execAsync(`sudo cp "${filePath}" "${backupPath}"`);
    return backupPath;
  } catch (error) {
    throw new Error(`Failed to create backup: ${error}`);
  }
}

export async function safeEditFile(
  filePath: string,
  editFn: (content: string) => string
): Promise<{ success: boolean; backup: string; diff: string }> {
  try {
    // Create backup
    const backupPath = await createBackup(filePath);
    
    // Read current content
    const { stdout: content } = await execAsync(`sudo cat "${filePath}"`);
    
    // Apply edit
    const newContent = editFn(content);
    
    // Write to temp file
    const tempFile = `/tmp/pam-edit-${Date.now()}`;
    await writeFile(tempFile, newContent);
    
    // Move temp file to target (requires sudo)
    await execAsync(`sudo mv "${tempFile}" "${filePath}"`);
    
    // Generate diff
    let diff = '';
    try {
      const { stdout: diffOutput } = await execAsync(`diff -u "${backupPath}" "${filePath}" || true`);
      diff = diffOutput;
    } catch (error) {
      diff = 'Diff unavailable';
    }
    
    return {
      success: true,
      backup: backupPath,
      diff,
    };
  } catch (error: any) {
    throw new Error(`Safe edit failed: ${error.message}`);
  }
}

export async function setMinPasswordLength(minLength: number): Promise<any> {
  const filePath = '/etc/pam.d/common-password';
  
  return await safeEditFile(filePath, (content) => {
    // Look for pam_unix.so or pam_pwquality.so line
    const lines = content.split('\n');
    let modified = false;
    
    const newLines = lines.map(line => {
      if (line.includes('pam_unix.so') || line.includes('pam_pwquality.so')) {
        // Remove existing minlen parameter
        let newLine = line.replace(/minlen=\d+/, '').trim();
        
        // Add new minlen parameter
        if (!newLine.includes('minlen=')) {
          newLine = `${newLine} minlen=${minLength}`;
          modified = true;
        }
        
        return newLine;
      }
      return line;
    });
    
    return newLines.join('\n');
  });
}

export async function setPasswordRemember(remember: number): Promise<any> {
  const filePath = '/etc/pam.d/common-password';
  
  return await safeEditFile(filePath, (content) => {
    const lines = content.split('\n');
    
    const newLines = lines.map(line => {
      if (line.includes('pam_unix.so')) {
        // Remove existing remember parameter
        let newLine = line.replace(/remember=\d+/, '').trim();
        
        // Add new remember parameter
        if (!newLine.includes('remember=')) {
          newLine = `${newLine} remember=${remember}`;
        }
        
        return newLine;
      }
      return line;
    });
    
    return newLines.join('\n');
  });
}

export async function disableNullPasswords(): Promise<any> {
  const filePath = '/etc/pam.d/common-auth';
  
  return await safeEditFile(filePath, (content) => {
    // Remove 'nullok' from all lines
    return content.replace(/\s+nullok\s*/g, ' ').replace(/\s+nullok$/gm, '');
  });
}

