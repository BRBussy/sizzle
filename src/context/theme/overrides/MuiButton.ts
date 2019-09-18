import { Theme } from '@material-ui/core';
import { HexToRGBA } from 'utils/Utils';

const defaultButtonColor = '#7a788d';

export const MuiButton = (theme: Theme) => ({
  root: {
    textTransform: undefined,
    minWidth: '158px'
  },
  textPrimary: {},
  contained: {
    'backgroundColor': defaultButtonColor,
    'color': theme.palette.text.primary,
    'border': '1px solid #43425D',
    '&:disabled': {
      color: HexToRGBA(theme.palette.text.primary, '0.2'),
      backgroundColor: HexToRGBA(defaultButtonColor, '0.2'),
      border: 'none'
    },
    '&:hover': {
      backgroundColor: HexToRGBA(defaultButtonColor, '0.8')
    }
  },
  outlined: {
    'color': theme.palette.text.primary,
    'border': '1px solid #FFFFFF',
    '&:disabled': {
      color: HexToRGBA(defaultButtonColor, '0.2'),
      border: `1px solid ${HexToRGBA(defaultButtonColor, '0.2')}`
    }
  },
  containedPrimary: {
    '&:disabled': {
      color: HexToRGBA(theme.palette.text.primary, '0.2'),
      backgroundColor: HexToRGBA(theme.palette.primary.main, '0.2')
    },
    'color': theme.palette.text.primary,
    'border': 'none'
  },
  outlinedPrimary: {
    '&:disabled': {
      color: HexToRGBA(theme.palette.primary.main, '0.2'),
      border: `1px solid ${HexToRGBA(theme.palette.primary.main, '0.2')}`
    }
  },
  containedSecondary: {
    '&:disabled': {
      color: HexToRGBA(theme.palette.text.primary, '0.2'),
      backgroundColor: HexToRGBA(theme.palette.secondary.main, '0.2')
    },
    'color': theme.palette.text.primary,
    'border': 'none'
  },
  outlinedSecondary: {
    '&:disabled': {
      color: HexToRGBA(theme.palette.secondary.main, '0.2'),
      border: `1px solid ${HexToRGBA(theme.palette.secondary.main, '0.2')}`
    }
  },
  sizeSmall: {
    height: 25,
    minWidth: 82,
    padding: '0px 8px'
  }
});
