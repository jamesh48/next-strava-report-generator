import { Link, Box } from '@mui/material';

interface EditingContainerProps {
  handleActivityUpdate: () => void;
  handleEditingChange: React.MouseEventHandler<HTMLAnchorElement>;
  editing: boolean;
}

const EditingContainer = (props: EditingContainerProps) => (
  <Box className="editingContainer" sx={{ alignSelf: 'flex-end' }}>
    {props.editing && (
      <Link
        className="editingLink"
        onClick={props.handleActivityUpdate}
        sx={{
          color: 'blue',
          textDecoration: 'none',
          paddingX: '.5rem',
          cursor: 'pointer',
          '&:hover': {
            color: 'ivory',
          },
        }}
      >
        Submit!
      </Link>
    )}
    {/* <Link
      className="editingLink"
      onClick={props.handleEditingChange}
      sx={{
        color: 'blue',
        textDecoration: 'none',
        paddingX: '.5rem',
        cursor: 'pointer',
        '&:hover': {
          color: 'ivory',
        },
      }}
    >
      {props.editing ? 'Cancel' : 'Edit'}
    </Link> */}
  </Box>
);

export default EditingContainer;
