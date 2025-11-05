import * as React from 'react'
import { IMaskInput } from 'react-imask'
import { cn } from '@/lib/utils'

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  onAccept?: (value: string) => void
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, onAccept, onChange, value, ...props }, ref) => {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
      setMounted(true)
    }, [])

    // Render a regular input on server to match client initial render
    if (!mounted) {
      return (
        <input
          type="tel"
          {...props}
          value={value}
          onChange={(e) => {
            // Prevent read-only warning by providing onChange
            if (onChange) onChange(e)
            if (onAccept) onAccept(e.target.value)
          }}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
        />
      )
    }

    return (
      <IMaskInput
        mask="+00 (00) 00000-0000"
        onAccept={onAccept}
        inputRef={ref as React.Ref<HTMLInputElement>}
        {...props}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
      />
    )
  }
)

PhoneInput.displayName = 'PhoneInput'

export { PhoneInput }
