'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { LeadFilterSchema, LeadStatus, type LeadFilter } from '@/lib/zod-schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X } from 'lucide-react'

export function FiltersBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { register, handleSubmit, setValue, watch, reset } = useForm<LeadFilter>({
    resolver: zodResolver(LeadFilterSchema),
    defaultValues: {
      query: searchParams.get('query') || '',
      status: (searchParams.get('status') as LeadStatus) || undefined,
      source: searchParams.get('source') || '',
      from: searchParams.get('from') || '',
      to: searchParams.get('to') || '',
    },
  })

  const statusValue = watch('status')

  const onSubmit = (data: LeadFilter) => {
    const params = new URLSearchParams()
    
    if (data.query) params.set('query', data.query)
    if (data.status) params.set('status', data.status)
    if (data.source) params.set('source', data.source)
    if (data.from) params.set('from', data.from)
    if (data.to) params.set('to', data.to)

    const queryString = params.toString()
    router.replace(queryString ? `/dashboard?${queryString}` : '/dashboard')
  }

  const handleClear = () => {
    reset({
      query: '',
      status: undefined,
      source: '',
      from: '',
      to: '',
    })
    router.replace('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Input
          placeholder="Search by name..."
          {...register('query')}
          className="lg:col-span-2"
        />

        <Select
          value={statusValue || ''}
          onValueChange={(value) => setValue('status', value as LeadStatus)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="proposal">Proposal</SelectItem>
            <SelectItem value="won">Won</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder="Source" {...register('source')} />

        <Input type="date" placeholder="From" {...register('from')} />

        <Input type="date" placeholder="To" {...register('to')} />
      </div>

      <div className="flex gap-2">
        <Button type="submit">Search</Button>
        <Button type="button" variant="outline" onClick={handleClear}>
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>
    </form>
  )
}
