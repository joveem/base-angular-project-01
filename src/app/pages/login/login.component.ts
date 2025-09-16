import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    isConnecting = false;
    errorMessage: string | null = null;

    async connectWallet(): Promise<void> {
        if (this.isConnecting) {
            return;
        }

        this.isConnecting = true;
        this.errorMessage = null;

        try {
            console.log('01-01');
            await firstValueFrom(this.authService.login());
            console.log('01-02');
            await this.router.navigateByUrl('/');
            console.log('01-03');
        } catch (error) {
            console.error('Login failed', error);
            const message = error instanceof Error ? error.message : 'Wallet login failed. Please try again.';
            this.errorMessage = message;
        } finally {
            this.isConnecting = false;
        }
    }
}
