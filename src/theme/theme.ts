import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';
import Stack from './components/layout/Stack';
import Paper from './components/surfaces/Paper';
import Drawer from './components/navigation/Drawer';
import Button from './components/buttons/Button';
import ButtonBase from './components/buttons/ButtonBase';
import IconButton from './components/buttons/IconButton';
import CssBaseline from './components/utils/CssBaseline';
import Toolbar from './components/buttons/Toolbar';
import Collapse from './components/list/Collapse';
import Link from './components/navigation/Link';
import List from './components/list/List';
import MenuItem from './components/list/MenuItem';
import ListItemText from './components/list/ListItemText';
import ListItemIcon from './components/list/ListItemIcon';
import ListItemButton from './components/list/ListItemButton';
import InputBase from './components/inputs/InputBase';
import FilledInput from './components/inputs/FilledInput';
import OutlinedInput from './components/inputs/OutlinedInput';
import InputAdornment from './components/inputs/InputAdornment';
import Badge from './components/data-display/Badge';
import Select from './components/inputs/Select';
import Card from './components/cards/Card';
import CardMedia from './components/cards/CardMedia';
import CardHeader from './components/cards/CardHeader';
import CardContent from './components/cards/CardContent';
import CardActions from './components/cards/CardActions';
import Avatar from './components/data-display/Avatar';
import Slider from './components/inputs/Slider';
import Chip from './components/data-display/Chip';
import Checkbox from './components/inputs/Checkbox';
import DataGrid from './components/data-grid/DataGrid';
import Divider from './components/data-display/Divider';
import AvatarGroup from './components/data-display/AvatarGroup';
import FormControlLabel from './components/inputs/FormControlLabel';
import PaginationItem from './components/pagination/PaginationItem';
import customShadows from './shadows';
import typography from './typography';
import palette from './palette';

export const theme = createTheme({
  typography,
  palette,
  customShadows,
  components: {
    MuiStack: Stack,
    MuiDrawer: Drawer,
    MuiLink: Link,
    MuiPaper: Paper,
    MuiButton: Button,
    MuiButtonBase: ButtonBase,
    MuiIconButton: IconButton,
    MuiToolbar: Toolbar,
    MuiList: List,
    MuiCollapse: Collapse,
    MuiListItemIcon: ListItemIcon,
    MuiListItemText: ListItemText,
    MuiListItemButton: ListItemButton,
    MuiMenuItem: MenuItem,
    MuiInputBase: InputBase,
    MuiFilledInput: FilledInput,
    MuiOutlinedInput: OutlinedInput,
    MuiInputAdornment: InputAdornment,
    MuiFormControlLabel: FormControlLabel,
    MuiCheckbox: Checkbox,
    MuiSelect: Select,
    MuiSlider: Slider,
    MuiBadge: Badge,
    MuiChip: Chip,
    MuiCard: Card,
    MuiAvatar: Avatar,
    MuiCardMedia: CardMedia,
    MuiCardHeader: CardHeader,
    MuiCardContent: CardContent,
    MuiCardActions: CardActions,
    MuiAvatarGroup: AvatarGroup,
    MuiDivider: Divider,
    MuiDataGrid: DataGrid,
    MuiPaginationItem: PaginationItem,
    MuiCssBaseline: CssBaseline,
  },
});
