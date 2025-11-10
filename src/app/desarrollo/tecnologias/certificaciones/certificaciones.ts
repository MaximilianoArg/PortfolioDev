import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- Interface para una Certificación ---
interface Certification {
  id: string; // ID único, ej: 'aws-cda'
  title: string;
  issuingOrganization: string;
  issueDate: Date;
  expirationDate?: Date; // Opcional, si la certificación expira
  credentialId: string;
  credentialUrl: string;
  logoUrl: string; // URL del logo de la organización (AWS, Google, etc.)
}

@Component({
  selector: 'app-certificaciones',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './certificaciones.html',
  styleUrls: ['./certificaciones.scss']
})
export class CertificacionesComponente implements OnInit {

  // Arreglo para almacenar todas las certificaciones
  certifications: Certification[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadCertifications();
  }

  loadCertifications(): void {
    // --- SIMULACIÓN DE DATOS ---
    // En una app real, esto vendría de un servicio o archivo de configuración.
    this.certifications = [
      {
        id: 'aws-cda',
        title: 'AWS Certified Developer - Associate',
        issuingOrganization: 'Amazon Web Services',
        issueDate: new Date('2024-08-15'),
        expirationDate: new Date('2027-08-15'),
        credentialId: 'ABC-123-XYZ',
        credentialUrl: 'https://www.credly.com/your-badge-url',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg'
      },
      {
        id: 'gcp-ace',
        title: 'Google Cloud Certified - Associate Cloud Engineer',
        issuingOrganization: 'Google Cloud',
        issueDate: new Date('2023-11-20'),
        expirationDate: new Date('2026-11-20'),
        credentialId: 'DEF-456-UVW',
        credentialUrl: 'https://www.google.com/your-credential-url',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg'
      },
      {
        id: 'scrum-psm1',
        title: 'Professional Scrum Master I (PSM I)',
        issuingOrganization: 'Scrum.org',
        issueDate: new Date('2022-05-30'),
        credentialId: 'GHI-789-RST',
        credentialUrl: 'https://www.scrum.org/your-certificate-url',
        logoUrl: 'https://scrumorg-website-prod.s3.amazonaws.com/drupal/2020-07/logo-240x240.png'
      }
    ].sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime()); // Ordenar por fecha, más reciente primero
  }

  // Helper para verificar si la certificación está a punto de expirar
  isExpiringSoon(cert: Certification): boolean {
    if (!cert.expirationDate) return false;
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);
    return cert.expirationDate <= threeMonthsFromNow;
  }
}