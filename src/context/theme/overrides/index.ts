import { Theme } from '@material-ui/core';
import { MuiButton } from './MuiButton';

const overrides = (theme: Theme) => ({
  MuiButton: MuiButton(theme)
});

export default overrides;
