import React from 'react';
import { Box, Grid, Typography, Link, useTheme, IconButton, Divider } from '@mui/material';
import { Facebook, Twitter, YouTube, Instagram, LinkedIn } from '@mui/icons-material';

const footerLinks = {
  explore: ['Fandom', 'Gamepedia', 'D&D Beyond', 'Cortex RPG', 'Muthead', 'Futhead'],
  overview: ['About', 'Careers', 'Press', 'Contact', 'Terms of Use', 'Privacy Policy', 'Global Sitemap', 'Local Sitemap'],
  community: ['Community Central', 'Support', 'Help', 'Do Not Sell My Info'],
  advertise: ['Media Kit', 'Contact'],
};

const socialIcons = [
  { icon: <Facebook />, url: '#' },
  { icon: <Twitter />, url: '#' },
  { icon: <YouTube />, url: '#' },
  { icon: <Instagram />, url: '#' },
  { icon: <LinkedIn />, url: '#' },
];

export default function Footer() {
  const theme = useTheme();
  const textColor = theme.palette.mode === 'dark' ? '#ffffffcc' : '#000000cc';

  const renderLinks = (title, items) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: textColor, mb: 1 }}>
        {title}
      </Typography>
      {items.map((item) => (
        <Typography key={item} variant="body2" sx={{ color: textColor, mb: 0.5 }}>
          <Link href="#" underline="hover" color="inherit">{item}</Link>
        </Typography>
      ))}
    </Box>
  );

  return (
    <Box sx={{ bgcolor: theme.palette.background.paper, py: 6, mt: 4, borderTop: `1px solid ${theme.palette.divider}` }}>
      <Grid container spacing={4} sx={{px: 4}}>
        <Grid size={{xs:12, md:3}}>
          {renderLinks('EXPLORE PROPERTIES', footerLinks.explore)}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            {socialIcons.map(({ icon, url }, i) => (
              <IconButton key={i} href={url} sx={{ color: textColor }}>
                {icon}
              </IconButton>
            ))}
          </Box>
        </Grid>

        <Grid size={{xs:12, md:3}}>
          {renderLinks('OVERVIEW', footerLinks.overview)}
        </Grid>

        

       
       {/* Quick Links */}
       <Grid size={{xs:12, md:3}}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Quick Link
          </Typography>
          {['Style Guide', 'Career', 'Help Text'].map((text) => (
            <Link
              key={text}
              href="#"
              underline="none"
              sx={{ display: 'block', color: textColor, mb: 0.5, fontSize: 14 }}
            >
              {text}
            </Link>
          ))}
        </Grid>

        {/* Social Icons */}
        <Grid size={{xs:12, md:3}}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Social Share
          </Typography>
          <Box>
            {[Facebook, Twitter, Instagram, YouTube].map((Icon, i) => (
              <IconButton key={i} color="inherit" size="small" sx={{ color: textColor }}>
                <Icon fontSize="small" />
              </IconButton>
            ))}
          </Box>
        </Grid>
    


      </Grid>
      {/* Footer Bottom */}
      <Divider/>
      <Box mt={3} px={4} textAlign="center" fontSize={14} color={textColor}>
        © Copyright 2025. Powered by <Link href="#" underline="hover" color="inherit">Shoaiby31@gmail.com</Link>
      </Box>
    </Box>
  );
}