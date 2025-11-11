import type { ButtonProps } from '@mui/material'
import { Button } from '@mui/material'
import type { LinkComponent } from '@tanstack/react-router'
import { createLink } from '@tanstack/react-router'
import { forwardRef } from 'react'

const MUIButtonLinkComponent = forwardRef<
  HTMLAnchorElement,
  ButtonProps<'a'>
>((props, ref) => <Button ref={ref} component="a" {...props} />)

const CreatedButtonLinkComponent = createLink(MUIButtonLinkComponent)

export const CustomButtonLink: LinkComponent<typeof MUIButtonLinkComponent> = (
  props,
) => {
  return <CreatedButtonLinkComponent preload={'intent'} {...props} />
}