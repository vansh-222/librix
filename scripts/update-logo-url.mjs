import fs from 'fs';
import path from 'path';

const OLD_URL = "https://res.cloudinary.com/dadiutcqh/image/upload/v1784448482/e2d37f27-b9e1-484c-a59b-79e086b1aec2_rah6h8.png";
const NEW_URL = "https://res.cloudinary.com/dadiutcqh/image/upload/v1784449649/c7205191-78c8-486e-9996-7894591bf72b_szzaji.png";
const TARGETS = [
  'src/components/shared/Sidebar.js',
  'src/components/librarian/LibrarianSidebar.js',
  'src/components/student/StudentSidebar.js',
  'src/app/page.js'
];

TARGETS.forEach(file => {
  const fullPath = path.resolve(file);
  if (fs.existsSync(fullPath)) {
    let original = fs.readFileSync(fullPath, 'utf8');
    let replaced = original.replaceAll(OLD_URL, NEW_URL);
    if (original !== replaced) {
      fs.writeFileSync(fullPath, replaced, 'utf8');
      console.log(`Updated logo URL in ${file}`);
    }
  }
});
