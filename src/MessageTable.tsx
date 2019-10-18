import React, { useState } from 'react';
import protobuf from 'protobufjs';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
import Link from './Link';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';

const useStyles = makeStyles(theme => ({
  root: {
    overflowX: 'auto',
    marginBottom: theme.spacing(4),
  },
  expandHeader: {
    width: 100,
  },
  fieldHeader: {
    width: '30%',
  },
  cellNested: {
    padding: 0,
  },
  typeHeader: {
    width: '20%',
  },
  descriptionHeader: {
    width: '100%',
  },
  repeated: {
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

const FieldRow: React.FC<{ field: protobuf.Field; depth: number }> = ({
  field,
  depth,
}) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const style = {
    paddingLeft: 16 * (1 + 2 * depth),
  };
  return (
    <>
      <TableRow>
        <TableCell padding="checkbox">
          {field.resolvedType && field.resolvedType instanceof protobuf.Type && (
            <IconButton size="small" onClick={() => setOpen(open => !open)}>
              {open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
        </TableCell>
        <TableCell className={classes.fieldHeader} style={style}>
          {field.name}
        </TableCell>
        <TableCell className={classes.typeHeader}>
          {field.resolvedType ? (
            <Link to={`/${field.resolvedType.fullName}`}>
              {field.resolvedType.name}
            </Link>
          ) : (
            field.type
          )}
          {field.repeated && (
            <>
              {' '}
              <Chip label="repeated" size="small" />
            </>
          )}
        </TableCell>
        <TableCell className={classes.descriptionHeader}>
          {field.comment}
        </TableCell>
      </TableRow>
      {field.resolvedType &&
        field.resolvedType instanceof protobuf.Type &&
        open && (
          <MessageTableInner message={field.resolvedType} depth={depth + 1} />
        )}
    </>
  );
};

const MessageTableInner: React.FC<{
  message: protobuf.Type;
  depth?: number;
}> = ({ message, depth = 0 }) => {
  return (
    <>
      {message.fieldsArray.map(field => (
        <FieldRow field={field} key={`${field.fullName}`} depth={depth} />
      ))}
    </>
  );
};

const MessageTable: React.FC<{
  message: protobuf.Type;
}> = ({ message }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Field</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <MessageTableInner message={message} />
        </TableBody>
      </Table>
    </Paper>
  );
};

export default MessageTable;