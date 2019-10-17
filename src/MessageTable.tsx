import React from 'react';
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

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
    marginBottom: theme.spacing(4),
  },
  fieldHeader: {
    minWidth: '30%',
  },
  cellNested: {
    padding: 0,
  },
  typeHeader: {
    minWidth: '20%',
  },
  repeated: {
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

const MessageTableInner: React.FC<{
  message: protobuf.Type;
  headless?: boolean;
  depth?: number;
}> = ({ message, headless, depth = 0 }) => {
  const classes = useStyles();
  const style = {
    paddingLeft: 16 * (1 + depth),
  };
  return (
    <Table>
      {!headless && (
        <TableHead>
          <TableRow>
            <TableCell>Field</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
      )}
      <TableBody>
        {message.fieldsArray.map(field => (
          <React.Fragment key={`${message.fullName}.${field.name}`}>
            <TableRow>
              <TableCell className={classes.fieldHeader} style={style}>
                {field.name}
              </TableCell>
              <TableCell className={classes.typeHeader}>
                {field.repeated && (
                  <>
                    <Chip label="repeated" size="small" />{' '}
                  </>
                )}
                {field.resolvedType ? (
                  <Link to={`/${field.resolvedType.fullName}`}>
                    {field.resolvedType.name}
                  </Link>
                ) : (
                  field.type
                )}
              </TableCell>
              <TableCell>{field.comment}</TableCell>
            </TableRow>
            {field.resolvedType && field.resolvedType instanceof protobuf.Type && (
              <TableRow>
                <TableCell colSpan={3} className={classes.cellNested}>
                  <MessageTableInner
                    message={field.resolvedType}
                    headless
                    depth={depth + 1}
                  />
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

const MessageTable: React.FC<{
  message: protobuf.Type;
  headless?: boolean;
}> = props => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <MessageTableInner {...props} />
    </Paper>
  );
};

export default MessageTable;
