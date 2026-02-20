// ===== Mobile Hamburger Menu Toggle =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking a nav link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== Navbar Scroll Effect =====
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Smooth Scroll for Navigation Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Form Submission Handling =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values using name attribute
    const name = this.querySelector('input[name="name"]').value;
    const email = this.querySelector('input[name="email"]').value;
    const message = this.querySelector('textarea[name="message"]').value;
    
    // Simple validation
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Create message object
    const messageData = {
        id: Date.now(),
        name: name,
        email: email,
        message: message,
        timestamp: new Date().toLocaleString()
    };
    
    // Get existing messages from localStorage
    let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    
    // Add new message
    messages.push(messageData);
    
    // Save to localStorage
    localStorage.setItem('contactMessages', JSON.stringify(messages));
    
    // Show success message on page
    const messageDisplay = document.getElementById('messageDisplay');
    document.getElementById('displayName').textContent = name;
    document.getElementById('displayEmail').textContent = email;
    document.getElementById('displayMessage').textContent = message;
    document.getElementById('displayTime').textContent = 'Sent: ' + messageData.timestamp;
    
    messageDisplay.style.display = 'block';
    contactForm.style.display = 'none';
    
    // Log to console for debugging
    console.log('Form submitted:', messageData);
    
    // Hide success message after 10 seconds and show form again
    setTimeout(() => {
        messageDisplay.style.display = 'none';
        contactForm.style.display = 'block';
        contactForm.reset();
    }, 10000);
});

// ===== Admin Panel Functionality =====
const adminAccessBtn = document.getElementById('adminAccessBtn');
const adminSection = document.getElementById('admin');
const adminPasswordSection = document.getElementById('adminPasswordSection');
const messagesList = document.getElementById('messagesList');
const messagesContainer = document.getElementById('messagesContainer');
const messageCount = document.getElementById('messageCount');
const loginAdmin = document.getElementById('loginAdmin');
const logoutAdmin = document.getElementById('logoutAdmin');
const clearMessages = document.getElementById('clearMessages');
const adminPassword = document.getElementById('adminPassword');

const ADMIN_PASSWORD = 'Pranav74';
let isAdminLoggedIn = false;

// Show admin panel (hidden button in corner)
adminAccessBtn.addEventListener('click', function() {
    if (adminSection.style.display === 'none') {
        adminSection.style.display = 'block';
        window.location.hash = 'admin';
    } else {
        adminSection.style.display = 'none';
    }
});

// Check if URL has admin hash on load
if (window.location.hash === '#admin') {
    adminSection.style.display = 'block';
}

// Admin login
loginAdmin.addEventListener('click', function() {
    if (adminPassword.value === ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        adminPasswordSection.style.display = 'none';
        messagesList.style.display = 'block';
        loadMessages();
        alert('Login successful!');
    } else {
        alert('Incorrect password!');
    }
});

// Admin logout
logoutAdmin.addEventListener('click', function() {
    isAdminLoggedIn = false;
    adminPasswordSection.style.display = 'block';
    messagesList.style.display = 'none';
    adminPassword.value = '';
});

// Load and display messages
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    messageCount.textContent = messages.length;
    
    if (messages.length === 0) {
        messagesContainer.innerHTML = '<p class="no-messages">No messages yet.</p>';
        return;
    }
    
    // Display messages in reverse order (newest first)
    messages.reverse().forEach(function(msg) {
        const messageCard = document.createElement('div');
        messageCard.className = 'message-card';
        messageCard.innerHTML = `
            <div class="message-header">
                <strong>${msg.name}</strong>
                <span class="message-time">${msg.timestamp}</span>
            </div>
            <div class="message-email">${msg.email}</div>
            <div class="message-text">${msg.message}</div>
            <button class="delete-msg-btn" data-id="${msg.id}">Delete</button>
        `;
        messagesContainer.appendChild(messageCard);
    });
    
    // Add delete functionality
    document.querySelectorAll('.delete-msg-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const msgId = parseInt(this.getAttribute('data-id'));
            deleteMessage(msgId);
        });
    });
}

// Delete single message
function deleteMessage(msgId) {
    if (confirm('Are you sure you want to delete this message?')) {
        let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        messages = messages.filter(msg => msg.id !== msgId);
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        messagesContainer.innerHTML = '';
        loadMessages();
    }
}

// Clear all messages
clearMessages.addEventListener('click', function() {
    if (confirm('Are you sure you want to delete ALL messages? This cannot be undone.')) {
        localStorage.removeItem('contactMessages');
        messagesContainer.innerHTML = '';
        messageCount.textContent = '0';
        alert('All messages cleared!');
    }
});

// ===== Active Navigation Link on Scroll =====
const sections = document.querySelectorAll('section[id]');

function highlightNavOnScroll() {
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav-links a[href="#' + sectionId + '"]')?.classList.add('active');
        } else {
            document.querySelector('.nav-links a[href="#' + sectionId + '"]')?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', highlightNavOnScroll);

// ===== Fade In Animation on Scroll =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
document.querySelectorAll('.skill-card, .project-card, .stat').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add fade-in class dynamically
const fadeInStyle = document.createElement('style');
fadeInStyle.textContent = `
    .fade-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(fadeInStyle);

// ===== Console Welcome Message =====
console.log('%c👋 Welcome to John Doe\'s Portfolio!', 'font-size: 20px; font-weight: bold; color: #3b82f6;');
console.log('%cBuilt with HTML, CSS, and JavaScript', 'color: #10b981;');

