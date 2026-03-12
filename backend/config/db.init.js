const db = require('./db');

const createTables = async () => {
  try {

    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('admin', 'alumni', 'student', 'faculty') NOT NULL DEFAULT 'alumni',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ users table ready');

    await db.execute(`
      CREATE TABLE IF NOT EXISTS alumni_profiles (
        profile_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        full_name VARCHAR(100) NOT NULL,
        graduation_year YEAR NOT NULL,
        degree VARCHAR(100),
        department VARCHAR(100),
        phone VARCHAR(15),
        profile_photo VARCHAR(255),
        current_city VARCHAR(100),
        linkedin_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      )
    `);
    console.log('✅ alumni_profiles table ready');

    await db.execute(`
      CREATE TABLE IF NOT EXISTS education_history (
        edu_id INT AUTO_INCREMENT PRIMARY KEY,
        profile_id INT NOT NULL,
        institution VARCHAR(150) NOT NULL,
        degree VARCHAR(100),
        field_of_study VARCHAR(100),
        start_year YEAR,
        end_year YEAR,
        FOREIGN KEY (profile_id) REFERENCES alumni_profiles(profile_id) ON DELETE CASCADE
      )
    `);
    console.log('✅ education_history table ready');

    await db.execute(`
      CREATE TABLE IF NOT EXISTS work_experience (
        work_id INT AUTO_INCREMENT PRIMARY KEY,
        profile_id INT NOT NULL,
        company_name VARCHAR(150) NOT NULL,
        job_title VARCHAR(100),
        start_date DATE NOT NULL,
        end_date DATE,
        description TEXT,
        FOREIGN KEY (profile_id) REFERENCES alumni_profiles(profile_id) ON DELETE CASCADE
      )
    `);
    console.log('✅ work_experience table ready');

    await db.execute(`
      CREATE TABLE IF NOT EXISTS skills (
        skill_id INT AUTO_INCREMENT PRIMARY KEY,
        skill_name VARCHAR(100) NOT NULL UNIQUE
      )
    `);
    console.log('✅ skills table ready');

    await db.execute(`
      CREATE TABLE IF NOT EXISTS alumni_skills (
        profile_id INT NOT NULL,
        skill_id INT NOT NULL,
        proficiency ENUM('beginner', 'intermediate', 'expert') DEFAULT 'intermediate',
        PRIMARY KEY (profile_id, skill_id),
        FOREIGN KEY (profile_id) REFERENCES alumni_profiles(profile_id) ON DELETE CASCADE,
        FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
      )
    `);
    console.log('✅ alumni_skills table ready');

    await db.execute(`
      CREATE TABLE IF NOT EXISTS job_postings (
        job_id INT AUTO_INCREMENT PRIMARY KEY,
        posted_by INT NOT NULL,
        title VARCHAR(150) NOT NULL,
        company VARCHAR(150) NOT NULL,
        location VARCHAR(100),
        job_type ENUM('full-time', 'part-time', 'internship', 'contract') DEFAULT 'full-time',
        description TEXT,
        salary_range VARCHAR(50),
        deadline DATE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (posted_by) REFERENCES users(user_id)
      )
    `);
    console.log('✅ job_postings table ready');

    await db.execute(`
      CREATE TABLE IF NOT EXISTS job_applications (
        application_id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT NOT NULL,
        applicant_id INT NOT NULL,
        status ENUM('applied', 'reviewed', 'shortlisted', 'rejected', 'hired') DEFAULT 'applied',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES job_postings(job_id) ON DELETE CASCADE,
        FOREIGN KEY (applicant_id) REFERENCES users(user_id) ON DELETE CASCADE,
        UNIQUE KEY unique_application (job_id, applicant_id)
      )
    `);
    console.log('✅ job_applications table ready');

    await db.execute(`
      CREATE TABLE IF NOT EXISTS events (
        event_id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT,
        event_date DATETIME NOT NULL,
        location VARCHAR(200),
        created_by INT NOT NULL,
        max_capacity INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(user_id)
      )
    `);
    console.log('✅ events table ready');

    await db.execute(`
      CREATE TABLE IF NOT EXISTS event_registrations (
        reg_id INT AUTO_INCREMENT PRIMARY KEY,
        event_id INT NOT NULL,
        user_id INT NOT NULL,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        attendance_status ENUM('registered', 'attended', 'absent') DEFAULT 'registered',
        UNIQUE KEY unique_registration (event_id, user_id),
        FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      )
    `);
    console.log('✅ event_registrations table ready');

    await db.execute(`
      CREATE TABLE IF NOT EXISTS donations (
        donation_id INT AUTO_INCREMENT PRIMARY KEY,
        donor_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        purpose VARCHAR(200),
        payment_mode ENUM('UPI', 'netbanking', 'cash', 'cheque') DEFAULT 'UPI',
        donated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (donor_id) REFERENCES users(user_id)
      )
    `);
    console.log('✅ donations table ready');

    await db.execute(`
      CREATE TABLE IF NOT EXISTS mentorship (
        mentorship_id INT AUTO_INCREMENT PRIMARY KEY,
        mentor_id INT NOT NULL,
        mentee_id INT NOT NULL,
        domain VARCHAR(100),
        start_date DATE,
        end_date DATE,
        status ENUM('active', 'completed', 'dropped') DEFAULT 'active',
        FOREIGN KEY (mentor_id) REFERENCES users(user_id),
        FOREIGN KEY (mentee_id) REFERENCES users(user_id)
      )
    `);
    console.log('✅ mentorship table ready');

    console.log('\n🎉 All 10 tables created successfully!');
    process.exit(0);

  } catch (err) {
    console.error('❌ Error creating tables:', err.message);
    process.exit(1);
  }
};

createTables();
