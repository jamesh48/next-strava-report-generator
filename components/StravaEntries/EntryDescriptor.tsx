import { Typography } from '@mui/material'
import type { EntryDescriptorProps } from './EntryTypes'

const EntryDescriptor = (props: EntryDescriptorProps) => {
  return (
    <Typography className='entryDescriptor' sx={{ cursor: 'default' }}>
      {props.title} {props.value}
    </Typography>
  )
}

export default EntryDescriptor
