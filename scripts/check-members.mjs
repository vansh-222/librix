/**
 * Diagnostic script to check why members aren't showing
 */
import mongoose from 'mongoose';
import { config } from 'dotenv';
config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const UserSchema = new mongoose.Schema({
  collegeId: { type: mongoose.Schema.Types.ObjectId, default: null },
  name: String,
  email: String,
  role: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function checkMembers() {
  console.log('🔍 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected\n');

  // Find the librarian
  const librarian = await User.findOne({ email: 'librarian@apexcollege.edu' });
  if (!librarian) {
    console.log('❌ Librarian not found!');
    process.exit(1);
  }

  console.log('👤 Librarian found:');
  console.log('   Name:', librarian.name);
  console.log('   Email:', librarian.email);
  console.log('   Role:', librarian.role);
  console.log('   CollegeId:', librarian.collegeId);
  console.log('   CollegeId type:', typeof librarian.collegeId);
  console.log('');

  // Find all students and teachers
  const allUsers = await User.find({ role: { $in: ['student', 'teacher'] } });
  console.log('📊 All students and teachers in database:', allUsers.length);
  
  if (allUsers.length > 0) {
    console.log('');
    console.log('Sample users:');
    allUsers.slice(0, 3).forEach((u, i) => {
      console.log(`   ${i + 1}. ${u.name}`);
      console.log(`      Role: ${u.role}`);
      console.log(`      CollegeId: ${u.collegeId}`);
      console.log(`      CollegeId type: ${typeof u.collegeId}`);
      console.log(`      Match: ${String(u.collegeId) === String(librarian.collegeId)}`);
    });
  }

  console.log('');
  
  // Try the query that the API uses
  const query = {
    collegeId: librarian.collegeId,
    role: { $in: ['student', 'teacher'] }
  };
  
  console.log('🔎 Running API query:', JSON.stringify(query));
  const matchingUsers = await User.find(query);
  console.log('📋 Users matching API query:', matchingUsers.length);
  
  if (matchingUsers.length > 0) {
    matchingUsers.forEach((u, i) => {
      console.log(`   ${i + 1}. ${u.name} (${u.email}) - ${u.role}`);
    });
  } else {
    console.log('   ❌ No users found with this query!');
    console.log('');
    console.log('💡 Checking users by college separately:');
    const usersWithCollege = await User.find({ 
      role: { $in: ['student', 'teacher'] },
      collegeId: { $ne: null }
    });
    console.log(`   Found ${usersWithCollege.length} users with a collegeId`);
    
    if (usersWithCollege.length > 0) {
      const uniqueColleges = [...new Set(usersWithCollege.map(u => String(u.collegeId)))];
      console.log(`   Unique collegeIds: ${uniqueColleges.length}`);
      uniqueColleges.forEach(id => {
        console.log(`      - ${id}`);
      });
    }
  }

  await mongoose.disconnect();
}

checkMembers().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
