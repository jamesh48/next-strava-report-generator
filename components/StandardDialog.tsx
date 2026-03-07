import CloseIcon from '@mui/icons-material/Close'
import { DialogActions, type SxProps, styled, useTheme } from '@mui/material'
import {
  type DialogProps,
  default as MuiDialog,
  type DialogProps as MuiDialogProps,
} from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import MuiDialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import { isNull, set } from 'lodash'
import type { ReactNode } from 'react'
import { When } from 'react-if'

interface CustomDialogProps extends DialogProps {
  customMaxWidth?: string
}
export const StandardStyledDialog = styled(MuiDialog)<CustomDialogProps>(
  ({ theme, customMaxWidth }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2.5),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(2.5),
    },
    '.MuiDialog-container > .MuiPaper-root': {
      borderRadius: '8px',
      maxWidth: customMaxWidth,
    },
  }),
)

export interface StandardDialogProps extends MuiDialogProps {
  title?: string
  extraTitle?: ReactNode
  actions?: ReactNode | undefined
  onClose?: () => void
  onSubmit?: (data?: any) => void
  backgroundColor?: string
  height?: string
  minHeight?: string
  contentStyle?: any
  footerBackgroundColor?: string
  draggable?: boolean
  customMaxWidth?: string
  // draggableResetRef?: React.MutableRefObject<DraggableDialogHandle | null>;
}

export interface StandardDialogTitleProps {
  id: string
  children?: ReactNode
  onClose?: () => void
  sx?: SxProps
}

export const StandardDialogTitle = ({
  children,
  onClose,
  ...props
}: StandardDialogTitleProps) => {
  return (
    <MuiDialogTitle
      sx={{
        m: 0,
        p: 2.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        // fontFamily: fonts.secondary.fontFamily,
        ...props.sx,
      }}
      {...props}
    >
      {children}
      <When condition={!!onClose}>
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{ color: (theme) => theme.palette.grey[500] }}
          tabIndex={-1}
        >
          <CloseIcon />
        </IconButton>
      </When>
    </MuiDialogTitle>
  )
}

const StandardDialog = ({
  title,
  open,
  onClose,
  onSubmit,
  children,
  extraTitle,
  minHeight: _minHeight,
  backgroundColor,
  actions = null,
  height = '100%',
  maxWidth = 'md',
  footerBackgroundColor,
  contentStyle = {},
  draggable = false,
  customMaxWidth,
  PaperProps,
  ...props
}: StandardDialogProps) => {
  const theme = useTheme()
  const style = {}
  if (height) set(style, 'height', height)

  return (
    <StandardStyledDialog
      disableRestoreFocus
      open={open}
      onClose={onClose}
      disableEscapeKeyDown={props.disableEscapeKeyDown}
      maxWidth={maxWidth}
      customMaxWidth={customMaxWidth}
      fullWidth={true}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      PaperComponent={
        props.PaperComponent
        // draggable ? DraggablePaperComponent : props.PaperComponent
      }
      PaperProps={{
        ...PaperProps,
        sx: {
          backgroundColor,
          ...style,
        },
        // ref: props.draggableResetRef,
      }}
      {...props}
    >
      <form
        onSubmit={(e) => {
          e?.preventDefault()
          return onSubmit?.(e)
        }}
        style={style}
      >
        <Stack
          height='100%'
          sx={{ backgroundColor, display: 'flex', ...style }}
        >
          {/* title */}
          <Stack width='100%'>
            <StandardDialogTitle id='alert-dialog-title' onClose={onClose}>
              {title}
            </StandardDialogTitle>
            <When condition={!!extraTitle}>
              <StandardDialogTitle
                id='alert-dialog-extra-title'
                sx={{ fontSize: '1rem', py: 0, fontWeight: 400 }}
              >
                {extraTitle}
              </StandardDialogTitle>
            </When>
          </Stack>

          {/* body */}
          <Stack sx={{ overflowY: 'auto', height: '100%' }}>
            <DialogContent style={{ paddingTop: 0, ...contentStyle }}>
              {children}
            </DialogContent>
          </Stack>

          {/* actions/footer */}
          <When condition={!isNull(actions)}>
            <Stack
              width='100%'
              flex={1}
              sx={{
                backgroundColor:
                  footerBackgroundColor ||
                  backgroundColor ||
                  theme.palette.background.paper,
                position: 'sticky',
                bottom: 0,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <DialogActions
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                {actions}
              </DialogActions>
            </Stack>
          </When>
        </Stack>
      </form>
    </StandardStyledDialog>
  )
}

export default StandardDialog
