import { Box } from '@mui/material'
import { useSelector } from '@redux/reduxHooks'
import {
  getCurrentActivity,
  useUpdateIndividualEntryMutation,
} from '@redux/slices'
import type React from 'react'
import { useEffect, useState } from 'react'
import DetailedEntry from './DetailedEntry'
import type { CachedEntry, Format, Sport, UIEntry } from './EntryTypes'
import GeneralEntry from './GeneralEntry'
import type { CustomMouseEventHandler } from './Report'

export interface StravaEntryProps {
  showIndividualEntry: CustomMouseEventHandler
  sport: Sport
  entry: UIEntry
  format: Format
  no: number | undefined
  handleCloseCurrentActivity: () => void
  isSharedActivity?: true
}

const StravaEntry = (props: StravaEntryProps) => {
  const [editingDescription, setEditingDescription] = useState(false)
  const [editingHeadline, setEditingHeadline] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [editedDescription, setEditedDescription] = useState('')
  const [handleActivityUpdateMutation] = useUpdateIndividualEntryMutation()

  const currentActivity = useSelector(getCurrentActivity)

  useEffect(() => {
    if (currentActivity.id === Number(props.entry.activityId)) {
      setEditedName(currentActivity.name)
      setEditedDescription(currentActivity.description)
    }
  }, [currentActivity, props.entry.activityId])

  const handleDescriptionChange: (e: { target: { value: string } }) => void = (
    e,
  ) => {
    setEditedDescription(e.target.value)
  }

  const handleNameChange: (e: { target: { value: string } }) => void = (e) => {
    setEditedName(e.target.value)
  }

  const handleEditingHeadlineChange = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | true,
  ) => {
    // Page Refresh is Prevented at the ground level
    if (props.isSharedActivity) {
      return
    }
    // If Clickaway Event Happens while editing, send api request.
    if (e === true) {
      setEditingHeadline(false)
      handleActivityUpdateMutation({
        activityId: currentActivity.id,
        name: editedName,
        description: editedDescription,
      })
    } else {
      e.preventDefault()
      if (currentActivity.id === Number(props.entry.activityId)) {
        setEditingHeadline(true)
      } else {
        if (props.entry.individualActivityCached) {
          const cachedEntry = props.entry as UIEntry & CachedEntry
          props.showIndividualEntry(e, cachedEntry)
        } else {
          props.showIndividualEntry(e)
        }
      }
    }
  }

  const handleEditingDesciptionChange = () => {
    if (editingDescription) {
      setEditingDescription(false)
      handleActivityUpdateMutation({
        activityId: currentActivity.id,
        name: editedName,
        description: editedDescription,
      })
    } else {
      setEditingDescription(true)
    }
  }

  const isCurrentActivity =
    currentActivity?.id === Number(props.entry.activityId)
  return (
    <Box sx={{ width: '100%' }}>
      <GeneralEntry
        sport={props.sport}
        no={props.no}
        entry={props.entry}
        format={props.format}
        editingHeadline={editingHeadline}
        editedName={editedName}
        handleEditingHeadlineChange={handleEditingHeadlineChange}
        handleNameChange={handleNameChange}
        isCurrentActivity={isCurrentActivity}
        isSharedActivity={props.isSharedActivity}
      />
      {isCurrentActivity && (
        <DetailedEntry
          editingDescription={editingDescription}
          editedDescription={editedDescription}
          handleEditingDescriptionChange={handleEditingDesciptionChange}
          handleDescriptionChange={handleDescriptionChange}
          format={props.format}
          handleCloseCurrentActivity={props.handleCloseCurrentActivity}
          isSharedActivity={props.isSharedActivity}
        />
      )}
    </Box>
  )
}

export default StravaEntry
