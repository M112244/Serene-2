// ConstructHub - Construction Management Application
// Data Storage and State Management

class ConstructHub {
  constructor() {
    this.projects = this.loadFromStorage('projects') || [];
    this.teamMembers = this.loadFromStorage('teamMembers') || [];
    this.currentProject = null;
    this.init();
  }

  // Storage Management
  loadFromStorage(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  }

  saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // Initialize Application
  init() {
    this.setupEventListeners();
    this.renderDashboard();
    this.renderAllProjects();
    this.renderTeamMembers();
    this.updateStats();
  }

  // Event Listeners Setup
  setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.dataset.view;
        this.switchView(view);
      });
    });

    // Create Project Buttons
    document.getElementById('createProjectBtn')?.addEventListener('click', () => {
      this.openModal('createProjectModal');
    });
    document.getElementById('createProjectBtn2')?.addEventListener('click', () => {
      this.openModal('createProjectModal');
    });

    // Create Project Form
    document.getElementById('createProjectForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.createProject();
    });

    // Cancel Project Button
    document.getElementById('cancelProjectBtn')?.addEventListener('click', () => {
      this.closeModal('createProjectModal');
    });

    // Add Team Member Button
    document.getElementById('addTeamMemberBtn')?.addEventListener('click', () => {
      this.openModal('addTeamMemberModal');
    });

    // Add Team Member Form
    document.getElementById('addTeamMemberForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addTeamMember();
    });

    // Assign Team Button (in project details)
    document.getElementById('assignTeamBtn')?.addEventListener('click', () => {
      this.openModal('assignTeamModal');
    });

    // Assign Team Form
    document.getElementById('assignTeamForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.assignTeamToProject();
    });

    // Cancel Team Button
    document.getElementById('cancelTeamBtn')?.addEventListener('click', () => {
      this.closeModal('assignTeamModal');
    });

    // Modal Close Buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) {
          modal.classList.remove('active');
        }
      });
    });

    // Close modal on background click
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });
  }

  // View Management
  switchView(viewName) {
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.view === viewName) {
        link.classList.add('active');
      }
    });

    // Update view sections
    document.querySelectorAll('.view-section').forEach(section => {
      section.classList.remove('active');
    });
    document.getElementById(`${viewName}-view`)?.classList.add('active');

    // Refresh data for the view
    if (viewName === 'dashboard') {
      this.renderDashboard();
    } else if (viewName === 'projects') {
      this.renderAllProjects();
    } else if (viewName === 'team') {
      this.renderTeamMembers();
    }
  }

  // Modal Management
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      // Reset form if exists
      const form = modal.querySelector('form');
      if (form) {
        form.reset();
      }
    }
  }

  // Project Management
  createProject() {
    const project = {
      id: Date.now().toString(),
      name: document.getElementById('projectName').value,
      description: document.getElementById('projectDescription').value,
      location: document.getElementById('projectLocation').value,
      startDate: document.getElementById('projectStartDate').value,
      endDate: document.getElementById('projectEndDate').value,
      budget: document.getElementById('projectBudget').value,
      status: document.getElementById('projectStatus').value,
      team: [],
      createdAt: new Date().toISOString()
    };

    this.projects.push(project);
    this.saveToStorage('projects', this.projects);

    this.closeModal('createProjectModal');
    this.renderDashboard();
    this.renderAllProjects();
    this.updateStats();

    this.showNotification('Project created successfully!', 'success');
  }

  deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projects = this.projects.filter(p => p.id !== projectId);
      this.saveToStorage('projects', this.projects);
      this.renderDashboard();
      this.renderAllProjects();
      this.updateStats();
      this.closeModal('projectDetailsModal');
      this.showNotification('Project deleted successfully!', 'success');
    }
  }

  // Team Management
  addTeamMember() {
    const member = {
      id: Date.now().toString(),
      role: document.getElementById('newMemberRole').value,
      name: document.getElementById('newMemberName').value,
      email: document.getElementById('newMemberEmail').value,
      phone: document.getElementById('newMemberPhone').value,
      company: document.getElementById('newMemberCompany').value,
      createdAt: new Date().toISOString()
    };

    this.teamMembers.push(member);
    this.saveToStorage('teamMembers', this.teamMembers);

    this.closeModal('addTeamMemberModal');
    this.renderTeamMembers();
    this.updateStats();

    this.showNotification('Team member added successfully!', 'success');
  }

  assignTeamToProject() {
    if (!this.currentProject) return;

    const member = {
      id: Date.now().toString(),
      role: document.getElementById('teamMemberRole').value,
      name: document.getElementById('teamMemberName').value,
      email: document.getElementById('teamMemberEmail').value,
      phone: document.getElementById('teamMemberPhone').value,
      company: document.getElementById('teamMemberCompany').value
    };

    const project = this.projects.find(p => p.id === this.currentProject.id);
    if (project) {
      project.team.push(member);
      this.saveToStorage('projects', this.projects);

      // Also add to global team members if not exists
      const existsInTeam = this.teamMembers.some(m => m.email === member.email);
      if (!existsInTeam) {
        this.teamMembers.push({...member, createdAt: new Date().toISOString()});
        this.saveToStorage('teamMembers', this.teamMembers);
      }

      this.closeModal('assignTeamModal');
      this.showProjectDetails(project);
      this.updateStats();

      this.showNotification('Team member assigned successfully!', 'success');
    }
  }

  // Rendering Functions
  renderDashboard() {
    const recentProjects = this.projects.slice(-3).reverse();
    const container = document.getElementById('recentProjectsList');

    if (recentProjects.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-folder-open"></i>
          <p>No projects yet. Create your first project to get started!</p>
        </div>
      `;
    } else {
      container.innerHTML = recentProjects.map(project => this.createProjectCard(project)).join('');

      // Add click listeners
      container.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
          const projectId = card.dataset.projectId;
          const project = this.projects.find(p => p.id === projectId);
          if (project) {
            this.showProjectDetails(project);
          }
        });
      });
    }
  }

  renderAllProjects() {
    const container = document.getElementById('projectsList');

    if (this.projects.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-folder-open"></i>
          <p>No projects yet. Create your first project to get started!</p>
        </div>
      `;
    } else {
      container.innerHTML = this.projects.map(project => this.createProjectCard(project)).join('');

      // Add click listeners
      container.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
          const projectId = card.dataset.projectId;
          const project = this.projects.find(p => p.id === projectId);
          if (project) {
            this.showProjectDetails(project);
          }
        });
      });
    }
  }

  createProjectCard(project) {
    const teamAvatars = project.team.slice(0, 3).map(member => {
      const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase();
      return `<div class="team-avatar" title="${member.name}">${initials}</div>`;
    }).join('');

    const moreCount = project.team.length > 3 ? `<span class="team-count">+${project.team.length - 3} more</span>` : '';

    return `
      <div class="project-card" data-project-id="${project.id}">
        <div class="project-header">
          <div>
            <h3 class="project-title">${project.name}</h3>
          </div>
          <span class="project-status ${project.status}">${project.status}</span>
        </div>
        <div class="project-info">
          <p><i class="fas fa-map-marker-alt"></i> ${project.location}</p>
          <p><i class="fas fa-calendar"></i> ${this.formatDate(project.startDate)} - ${this.formatDate(project.endDate)}</p>
          ${project.budget ? `<p><i class="fas fa-dollar-sign"></i> $${Number(project.budget).toLocaleString()}</p>` : ''}
        </div>
        <div class="project-footer">
          <div class="project-team-avatars">
            ${teamAvatars || '<span style="color: var(--text-secondary); font-size: 0.875rem;">No team assigned</span>'}
            ${moreCount}
          </div>
        </div>
      </div>
    `;
  }

  showProjectDetails(project) {
    this.currentProject = project;
    const modal = document.getElementById('projectDetailsModal');

    // Update title
    document.getElementById('projectDetailsTitle').textContent = project.name;

    // Update project info
    const infoContainer = document.getElementById('projectDetailsInfo');
    infoContainer.innerHTML = `
      <div class="info-item">
        <div class="info-label">Status</div>
        <div class="info-value">
          <span class="project-status ${project.status}">${project.status}</span>
        </div>
      </div>
      <div class="info-item">
        <div class="info-label">Description</div>
        <div class="info-value">${project.description || 'No description'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Location</div>
        <div class="info-value">${project.location}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Timeline</div>
        <div class="info-value">${this.formatDate(project.startDate)} - ${this.formatDate(project.endDate)}</div>
      </div>
      ${project.budget ? `
        <div class="info-item">
          <div class="info-label">Budget</div>
          <div class="info-value">$${Number(project.budget).toLocaleString()}</div>
        </div>
      ` : ''}
    `;

    // Update team list
    const teamContainer = document.getElementById('projectTeamList');
    if (project.team.length === 0) {
      teamContainer.innerHTML = `
        <div class="empty-state" style="padding: 2rem;">
          <i class="fas fa-users"></i>
          <p>No team members assigned yet.</p>
        </div>
      `;
    } else {
      teamContainer.innerHTML = project.team.map(member => `
        <div class="team-member-item">
          <div class="team-member-role">${this.getRoleLabel(member.role)}</div>
          <div class="team-member-name">${member.name}</div>
          <div class="team-member-contact">
            <div><i class="fas fa-envelope"></i> ${member.email}</div>
            ${member.phone ? `<div><i class="fas fa-phone"></i> ${member.phone}</div>` : ''}
            ${member.company ? `<div><i class="fas fa-building"></i> ${member.company}</div>` : ''}
          </div>
        </div>
      `).join('');
    }

    this.openModal('projectDetailsModal');
  }

  renderTeamMembers() {
    const roles = {
      client: 'clientsList',
      architect: 'architectsList',
      interior: 'interiorDesignersList',
      contractor: 'contractorsList',
      supplier: 'suppliersList',
      service: 'serviceProvidersList'
    };

    // Group members by role
    const membersByRole = {};
    Object.keys(roles).forEach(role => {
      membersByRole[role] = this.teamMembers.filter(m => m.role === role);
    });

    // Render each role section
    Object.entries(roles).forEach(([role, containerId]) => {
      const container = document.getElementById(containerId);
      const members = membersByRole[role];

      if (members.length === 0) {
        container.innerHTML = `
          <div class="empty-state" style="padding: 2rem;">
            <p style="font-size: 0.875rem;">No ${this.getRoleLabel(role).toLowerCase()} yet</p>
          </div>
        `;
      } else {
        container.innerHTML = members.map(member => `
          <div class="member-card">
            <div class="member-name">${member.name}</div>
            <div class="member-details">
              <span><i class="fas fa-envelope"></i> ${member.email}</span>
              ${member.phone ? `<span><i class="fas fa-phone"></i> ${member.phone}</span>` : ''}
              ${member.company ? `<span><i class="fas fa-building"></i> ${member.company}</span>` : ''}
            </div>
          </div>
        `).join('');
      }
    });
  }

  updateStats() {
    document.getElementById('totalProjects').textContent = this.projects.length;
    document.getElementById('activeProjects').textContent =
      this.projects.filter(p => p.status === 'active').length;
    document.getElementById('totalTeamMembers').textContent = this.teamMembers.length;

    // Count unique stakeholders (team members across all projects)
    const allProjectTeamMembers = this.projects.reduce((acc, project) => {
      return acc + project.team.length;
    }, 0);
    document.getElementById('totalStakeholders').textContent =
      this.teamMembers.length + allProjectTeamMembers;
  }

  // Utility Functions
  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getRoleLabel(role) {
    const labels = {
      client: 'Client',
      architect: 'Architect',
      interior: 'Interior Designer',
      contractor: 'Contractor',
      supplier: 'Supplier',
      service: 'Service Provider'
    };
    return labels[role] || role;
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : '#2563eb'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease reverse';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.constructHub = new ConstructHub();
});
