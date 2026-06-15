import CheckroomRoundedIcon from '@mui/icons-material/CheckroomRounded'
import { Stack, Typography } from '@mui/material'

export default function BrandLogo() {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <CheckroomRoundedIcon color="primary" />
      <Typography variant="h6" fontWeight={700} letterSpacing={1.2}>
        twocc
      </Typography>
    </Stack>
  )
}
