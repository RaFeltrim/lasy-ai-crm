'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, FileUp } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

export function ImportLeadsDialog() {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]
      
      if (validTypes.includes(selectedFile.type) || 
          selectedFile.name.endsWith('.csv') || 
          selectedFile.name.endsWith('.xlsx')) {
        setFile(selectedFile)
      } else {
        toast({
          title: 'Invalid file type',
          description: 'Please select a CSV or XLSX file',
          variant: 'destructive',
        })
      }
    }
  }

  const handleImport = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to import',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/leads/import', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Import failed')
      }

      // Check if any leads were actually imported
      if (result.inserted === 0 && result.updated === 0 && result.rejected > 0) {
        // Show errors if available
        const errorDetails = result.errors && result.errors.length > 0
          ? `\n\nFirst error: ${JSON.stringify(result.errors[0], null, 2)}`
          : ''
        
        toast({  
          title: 'Import completed with errors',
          description: `${result.rejected} leads rejected.${errorDetails}`,
          variant: 'destructive',
          duration: 10000, // 10 seconds for error messages
        })
      } else {
        const parts = []
        if (result.inserted > 0) parts.push(`${result.inserted} new`)
        if (result.updated > 0) parts.push(`${result.updated} updated`)
        if (result.rejected > 0) parts.push(`${result.rejected} rejected`)
        
        toast({  
          title: 'Import successful!',
          description: `Leads: ${parts.join(', ')}.`,
          duration: 5000,
        })
      }

      setOpen(false)
      setFile(null)
      
      // Force hard refresh to show imported leads
      router.refresh()
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error: unknown) {
      toast({
        title: 'Import failed',
        description: error instanceof Error ? error.message : 'An error occurred during import',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Importar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Leads</DialogTitle>
          <DialogDescription>
            Upload a CSV or XLSX file to import leads. Duplicate leads (same email) will be updated instead of creating duplicates.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file">Select File</Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file')?.click()}
                disabled={loading}
                className="w-full justify-start h-auto py-3"
              >
                <FileUp className="h-5 w-5 mr-2" />
                {file ? file.name : 'Choose file (CSV or XLSX)'}
              </Button>
              <Input
                id="file"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                disabled={loading}
                className="hidden"
              />
            </div>
            {file && (
              <p className="text-xs text-muted-foreground">
                ✓ File ready to import
              </p>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            <p className="font-semibold mb-1">Expected columns:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>name (required)</li>
              <li>email (optional)</li>
              <li>phone (optional)</li>
              <li>company (optional)</li>
              <li>status (optional, defaults to &apos;new&apos;)</li>
              <li>source (optional)</li>
            </ul>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!file || loading}>
            {loading ? 'Importing...' : 'Import'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
