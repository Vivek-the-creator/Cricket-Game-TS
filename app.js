"use strict";
/* ==========================================================================
   HAND CRICKET - GAME CONTROLLER (VANILLA TYPESCRIPT)
   ========================================================================== */
// 2. Audio Synthesizer Class (Web Audio API)
class SoundSynth {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }
    initCtx() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
    toggle(enabled) {
        this.enabled = enabled;
    }
    playStart() {
        if (!this.enabled)
            return;
        this.initCtx();
        if (!this.ctx)
            return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
    }
    playHit(isPerfect) {
        if (!this.enabled)
            return;
        this.initCtx();
        if (!this.ctx)
            return;
        const now = this.ctx.currentTime;
        // Sweet spot crack or normal hit thud
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(isPerfect ? 580 : 420, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
        gain.gain.setValueAtTime(isPerfect ? 0.35 : 0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
        if (isPerfect) {
            // Perfect shot chime
            const osc2 = this.ctx.createOscillator();
            const gain2 = this.ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(this.ctx.destination);
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(880, now + 0.04);
            osc2.frequency.exponentialRampToValueAtTime(1320, now + 0.22);
            gain2.gain.setValueAtTime(0, now);
            gain2.gain.linearRampToValueAtTime(0.12, now + 0.04);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
            osc2.start(now + 0.04);
            osc2.stop(now + 0.22);
        }
    }
    playWicket() {
        if (!this.enabled)
            return;
        this.initCtx();
        if (!this.ctx)
            return;
        const now = this.ctx.currentTime;
        // Descending sad synth buzzer
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(45, now + 0.45);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
        // Stumps rattling (noise buffer)
        try {
            const bufferSize = this.ctx.sampleRate * 0.12;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(1200, now);
            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.12, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(this.ctx.destination);
            noise.start(now);
            noise.stop(now + 0.12);
        }
        catch (e) {
            // Browser fallback
        }
    }
    playCheer() {
        if (!this.enabled)
            return;
        this.initCtx();
        if (!this.ctx)
            return;
        const now = this.ctx.currentTime;
        try {
            const bufferSize = this.ctx.sampleRate * 1.6;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(750, now);
            filter.frequency.exponentialRampToValueAtTime(1050, now + 0.7);
            filter.Q.setValueAtTime(1.2, now);
            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.01, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.1, now + 0.15); // swell
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6); // fade
            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(this.ctx.destination);
            noise.start(now);
            noise.stop(now + 1.6);
        }
        catch (e) {
            // Browser fallback
        }
    }
    playHighScore() {
        if (!this.enabled)
            return;
        this.initCtx();
        if (!this.ctx)
            return;
        const now = this.ctx.currentTime;
        const arpeggio = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        arpeggio.forEach((freq, idx) => {
            const noteTime = now + (idx * 0.08);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, noteTime);
            gain.gain.setValueAtTime(0.08, noteTime);
            gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.18);
            osc.start(noteTime);
            osc.stop(noteTime + 0.18);
        });
    }
}
// 3. Main Game Controller
class GameController {
    constructor() {
        // Persistence Data
        this.highestScore = 0;
        this.gamesHistory = [];
        // Game State Variables
        this.currentRuns = 0;
        this.currentWickets = 0;
        this.currentBalls = 0;
        this.currentBatsmanIndex = 0;
        this.isPlaying = false;
        this.isPaused = false;
        this.soundEnabled = true;
        this.batsmen = ['Rohit', 'Virat', 'Dhoni'];
        this.playerStats = {
            Rohit: { runs: 0, balls: 0, out: false },
            Virat: { runs: 0, balls: 0, out: false },
            Dhoni: { runs: 0, balls: 0, out: false }
        };
        // Timing Bar Animation Variables
        this.timingValue = 0.0; // Ranges from -1.0 (bottom) to 1.0 (top)
        this.timingDirection = -1; // -1 = downwards, 1 = upwards
        this.timingSpeed = 0.035; // Position increment per frame
        this.animationFrameId = null;
        this.isSwinging = false;
        // DOM Elements
        this.dom = {
            // Screens
            landingScreen: document.getElementById('landing-screen'),
            gameScreen: document.getElementById('game-screen'),
            gameOverScreen: document.getElementById('game-over-screen'),
            // Header
            gameHeader: document.getElementById('game-header'),
            btnHome: document.getElementById('btn-home'),
            btnSound: document.getElementById('btn-sound'),
            soundOnIcon: document.getElementById('sound-on-icon'),
            soundOffIcon: document.getElementById('sound-off-icon'),
            btnPause: document.getElementById('btn-pause'),
            btnRestart: document.getElementById('btn-restart'),
            // Landing Controls & Stats
            landingHighScore: document.getElementById('landing-high-score'),
            landingTotalGames: document.getElementById('landing-total-games'),
            landingHistoryList: document.getElementById('landing-history-list'),
            btnPlay: document.getElementById('btn-play'),
            // Game Panel
            scoreBatsman: document.getElementById('score-batsman'),
            batsmanIndividualScore: document.getElementById('batsman-individual-score'),
            scoreDisplay: document.getElementById('score-display'),
            scoreBalls: document.getElementById('score-balls'),
            scoreBestScore: document.getElementById('score-best-score'),
            batsmanAvatarContainer: document.getElementById('batsman-avatar-container'),
            batsmanAvatar: document.getElementById('batsman-avatar'),
            batterTag: document.getElementById('batter-tag'),
            pitchOverlay: document.getElementById('pitch-overlay'),
            btnBat: document.getElementById('btn-bat'),
            // Timing Bar
            timingIndicator: document.getElementById('timing-indicator'),
            timingBarContainer: document.getElementById('timing-bar-container'),
            // Game Over Panel
            newHighScoreBanner: document.getElementById('new-high-score-banner'),
            summaryTotalScore: document.getElementById('summary-total-score'),
            summaryHighScore: document.getElementById('summary-high-score'),
            btnReplay: document.getElementById('btn-replay'),
            btnMenu: document.getElementById('btn-menu'),
            // Batsmen Game Over Rows
            summaryRohitRuns: document.getElementById('summary-rohit-runs'),
            summaryRohitBalls: document.getElementById('summary-rohit-balls'),
            summaryRohitSr: document.getElementById('summary-rohit-sr'),
            summaryViratRuns: document.getElementById('summary-virat-runs'),
            summaryViratBalls: document.getElementById('summary-virat-balls'),
            summaryViratSr: document.getElementById('summary-virat-sr'),
            summaryDhoniRuns: document.getElementById('summary-dhoni-runs'),
            summaryDhoniBalls: document.getElementById('summary-dhoni-balls'),
            summaryDhoniSr: document.getElementById('summary-dhoni-sr'),
            // Pause Modal
            pauseModal: document.getElementById('pause-modal'),
            btnResume: document.getElementById('btn-resume'),
            btnModalRestart: document.getElementById('btn-modal-restart'),
            btnModalExit: document.getElementById('btn-modal-exit'),
            // Toasts
            toastContainer: document.getElementById('toast-container')
        };
        this.sound = new SoundSynth();
    }
    // 4. Initializer
    async init() {
        this.setupEventListeners();
        await this.loadScores();
        this.renderLandingStats();
    }
    // 5. Setup Listeners
    setupEventListeners() {
        // Navigation
        this.dom.btnPlay.addEventListener('click', () => {
            this.sound.playStart();
            this.startGame();
        });
        this.dom.btnHome.addEventListener('click', () => {
            this.sound.playStart();
            this.goToLanding();
        });
        this.dom.btnMenu.addEventListener('click', () => {
            this.sound.playStart();
            this.goToLanding();
        });
        this.dom.btnReplay.addEventListener('click', () => {
            this.sound.playStart();
            this.startGame();
        });
        // Sound Toggle
        this.dom.btnSound.addEventListener('click', () => {
            this.soundEnabled = !this.soundEnabled;
            this.sound.toggle(this.soundEnabled);
            if (this.soundEnabled) {
                this.dom.soundOnIcon.classList.remove('hidden');
                this.dom.soundOffIcon.classList.add('hidden');
            }
            else {
                this.dom.soundOnIcon.classList.add('hidden');
                this.dom.soundOffIcon.classList.remove('hidden');
            }
        });
        // Pause Controls
        this.dom.btnPause.addEventListener('click', () => this.pauseGame());
        this.dom.btnResume.addEventListener('click', () => this.resumeGame());
        // Restart Controls
        const handleRestart = () => {
            this.sound.playStart();
            this.resumeGame();
            this.startGame();
        };
        this.dom.btnRestart.addEventListener('click', handleRestart);
        this.dom.btnModalRestart.addEventListener('click', handleRestart);
        // Quit Controls
        this.dom.btnModalExit.addEventListener('click', () => {
            this.sound.playStart();
            this.resumeGame();
            this.goToLanding();
        });
        // Bat Swing Action
        this.dom.btnBat.addEventListener('click', () => this.swingBat());
        // Listen to spacebar as bat swing too
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.isPlaying && !this.isPaused && !this.isSwinging) {
                e.preventDefault(); // prevent scrolling
                this.swingBat();
            }
        });
    }
    // 6. DB Sync Layer
    async loadScores() {
        // Attempt local storage first (reliable cache)
        const localData = localStorage.getItem('handcricket_scores');
        if (localData) {
            try {
                const parsed = JSON.parse(localData);
                this.highestScore = parsed.highestScore || 0;
                this.gamesHistory = parsed.games || [];
            }
            catch (e) {
                console.error('Error parsing local storage scores, resetting cache.', e);
            }
        }
        // Attempt to fetch from Node Dev Server (file scores.json)
        try {
            const response = await fetch('/api/scores');
            if (response.ok) {
                const serverData = (await response.json());
                // Merge strategy: Keep the highest high score and union matches by date/scores
                this.highestScore = Math.max(this.highestScore, serverData.highestScore || 0);
                // If history lists differ, merge them
                if (serverData.games && serverData.games.length > this.gamesHistory.length) {
                    this.gamesHistory = serverData.games;
                }
                // Sync the merged result back to cache
                this.saveToLocalStorage();
            }
        }
        catch (err) {
            console.warn('Could not sync with Node.js scores api (normal for file:// or static server). Using localStorage fallback.');
        }
    }
    saveToLocalStorage() {
        const data = {
            highestScore: this.highestScore,
            games: this.gamesHistory
        };
        localStorage.setItem('handcricket_scores', JSON.stringify(data));
    }
    async saveScoreRecord(totalRuns, scoresRecord) {
        const record = {
            date: new Date().toISOString().split('T')[0],
            total: totalRuns,
            players: scoresRecord
        };
        let newHigh = false;
        if (totalRuns > this.highestScore) {
            this.highestScore = totalRuns;
            newHigh = true;
        }
        this.gamesHistory.unshift(record); // Add to beginning of array
        this.saveToLocalStorage();
        // Attempt API save
        try {
            const response = await fetch('/api/scores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    highestScore: this.highestScore,
                    games: this.gamesHistory
                })
            });
            if (response.ok) {
                console.log('Saved game stats to scores.json successfully.');
            }
        }
        catch (e) {
            console.warn('Could not POST game stats to server (running on static build). Score saved locally in browser.');
        }
        return newHigh;
    }
    // 7. Render UI Screens
    renderLandingStats() {
        this.dom.landingHighScore.textContent = this.highestScore.toString();
        this.dom.landingTotalGames.textContent = this.gamesHistory.length.toString();
        // Render History list
        this.dom.landingHistoryList.innerHTML = '';
        if (this.gamesHistory.length === 0) {
            this.dom.landingHistoryList.innerHTML = '<div class="history-empty">No games played yet. Hit play to start!</div>';
            return;
        }
        this.gamesHistory.slice(0, 5).forEach((game) => {
            const isBest = game.total === this.highestScore && this.highestScore > 0;
            const item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML = `
        <span class="history-date">${game.date}</span>
        <div class="history-score-capsule">
          <span class="history-run">${game.total} Runs</span>
          ${isBest ? '<span class="history-best-badge">BEST</span>' : ''}
        </div>
      `;
            this.dom.landingHistoryList.appendChild(item);
        });
    }
    // 8. Game Mechanics (Loop & Animations)
    startGame() {
        // Reset Game State
        this.currentRuns = 0;
        this.currentWickets = 0;
        this.currentBalls = 0;
        this.currentBatsmanIndex = 0;
        this.isPlaying = true;
        this.isPaused = false;
        this.isSwinging = false;
        this.batsmen.forEach((p) => {
            this.playerStats[p] = { runs: 0, balls: 0, out: false };
        });
        // Reset Avatars & Visuals
        this.resetAvatarAnimation();
        this.dom.btnBat.disabled = false;
        // Update Scoreboard Elements
        this.updateScoreboardDisplay();
        this.dom.scoreBestScore.textContent = this.highestScore.toString();
        // Transition Screens
        this.dom.landingScreen.classList.add('hidden');
        this.dom.gameOverScreen.classList.add('hidden');
        this.dom.gameScreen.classList.remove('hidden');
        this.dom.gameHeader.classList.remove('hidden');
        // Run animation loop
        this.timingValue = 0.0;
        this.timingDirection = -1; // Start moving downwards
        this.startTimingBarLoop();
    }
    startTimingBarLoop() {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
        }
        const loop = () => {
            if (!this.isPlaying || this.isPaused)
                return;
            this.advanceTimingBar();
            this.renderTimingBar();
            this.animationFrameId = requestAnimationFrame(loop);
        };
        this.animationFrameId = requestAnimationFrame(loop);
    }
    advanceTimingBar() {
        // Simple linear bounce calculations
        this.timingValue += this.timingDirection * this.timingSpeed;
        if (this.timingValue <= -1.0) {
            this.timingValue = -1.0;
            this.timingDirection = 1; // Reverse up
        }
        else if (this.timingValue >= 1.0) {
            this.timingValue = 1.0;
            this.timingDirection = -1; // Reverse down
        }
    }
    renderTimingBar() {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            // Horizontal display: map -1.0 -> 1.0 to left: 0% -> 100%
            const percentage = ((this.timingValue + 1.0) / 2.0) * 100;
            this.dom.timingIndicator.style.left = `${percentage}%`;
            this.dom.timingIndicator.style.top = ''; // Clear vertical
        }
        else {
            // Vertical display: map 1.0 (top) -> -1.0 (bottom) to top: 0% -> 100%
            // So percentage = (1.0 - timingValue) / 2.0 * 100
            const percentage = ((1.0 - this.timingValue) / 2.0) * 100;
            this.dom.timingIndicator.style.top = `${percentage}%`;
            this.dom.timingIndicator.style.left = ''; // Clear horizontal
        }
    }
    // 9. Bat Click Hit Logic
    swingBat() {
        if (!this.isPlaying || this.isPaused || this.isSwinging)
            return;
        this.isSwinging = true;
        this.dom.btnBat.disabled = true;
        // Trigger Swing Animations
        this.dom.btnBat.classList.add('active-swing');
        this.dom.batsmanAvatar.classList.add('swinging');
        // Read the exact value in the loop at this click timestamp
        const clickVal = this.timingValue;
        const absVal = Math.abs(clickVal);
        // Track ball faced
        const currentBatter = this.batsmen[this.currentBatsmanIndex];
        this.playerStats[currentBatter].balls += 1;
        this.currentBalls += 1;
        // Evaluate Hit Zones
        let runsScored = 0;
        let isWicket = false;
        let timingRating = '';
        // Zone boundaries:
        // Green: [-0.1, 0.1] -> absVal <= 0.1
        // Yellow: [-0.4, 0.1) and (0.1, 0.4] -> absVal > 0.1 && absVal <= 0.4
        // Red: remaining -> absVal > 0.4
        if (absVal <= 0.1) {
            // Green zone: PERFECT! (Either 4 or 6)
            runsScored = Math.random() < 0.5 ? 4 : 6;
            timingRating = 'Perfect Timing!';
        }
        else if (absVal <= 0.4) {
            // Yellow zone: GOOD! (1, 2, or 3 based on distance)
            // Closer to center gets higher runs:
            // absVal <= 0.2 -> 3 runs
            // absVal <= 0.3 -> 2 runs
            // absVal > 0.3 -> 1 run
            if (absVal <= 0.2) {
                runsScored = 3;
            }
            else if (absVal <= 0.3) {
                runsScored = 2;
            }
            else {
                runsScored = 1;
            }
            timingRating = 'Good Timing';
        }
        else {
            // Red zone: OUT!
            isWicket = true;
            timingRating = 'OUT!';
        }
        // Process result
        setTimeout(() => {
            if (isWicket) {
                this.handleWicket(clickVal);
            }
            else {
                this.handleRuns(runsScored, timingRating, clickVal);
            }
            // Cleanup Animations & enable batting after swing cycle
            setTimeout(() => {
                this.dom.btnBat.classList.remove('active-swing');
                this.dom.batsmanAvatar.classList.remove('swinging');
                if (this.isPlaying && !this.playerStats[currentBatter].out) {
                    this.dom.btnBat.disabled = false;
                    this.isSwinging = false;
                }
            }, 100);
        }, 150); // Small visual sync delay for bat hitting the ball
    }
    handleRuns(runs, rating, clickVal) {
        const currentBatter = this.batsmen[this.currentBatsmanIndex];
        // Add runs
        this.currentRuns += runs;
        this.playerStats[currentBatter].runs += runs;
        // Play sounds
        const isBoundary = runs === 4 || runs === 6;
        this.sound.playHit(isBoundary);
        if (isBoundary) {
            this.sound.playCheer();
        }
        // Show toasts
        this.showToast(rating, 'perfect');
        if (runs === 6) {
            this.showToast('SIX!', 'six');
            this.triggerFlashEffect('score');
        }
        else if (runs === 4) {
            this.showToast('FOUR!', 'four');
            this.triggerFlashEffect('score');
        }
        else {
            this.showToast(`+${runs} Runs`, 'runs');
        }
        // Neat Console Output Logger
        const icon = runs === 6 || runs === 4 ? '🔥' : '🏏';
        console.log(`%c${icon} [HIT] %c${currentBatter} %cscored ${runs} Runs %c(${rating}) | Timing: %c${clickVal.toFixed(3)}%c | Score: %c${this.currentRuns}/${this.currentWickets}%c (Ball: ${this.playerStats[currentBatter].balls})`, runs === 6 || runs === 4 ? 'font-size: 1.1rem;' : '', 'color: #00f2fe; font-weight: bold;', runs === 6 || runs === 4 ? 'color: #ffd700; font-weight: bold;' : 'color: #00ff7f; font-weight: bold;', 'color: #8f9ca8; font-style: italic;', 'color: #ffffff; background: #222; padding: 2px 5px; border-radius: 3px;', '', 'color: #ffffff; font-weight: bold; background: #008f51; padding: 1px 4px; border-radius: 3px;', 'color: #8f9ca8;');
        // Animation on Scoreboard
        this.dom.scoreDisplay.classList.add('score-pulse');
        setTimeout(() => this.dom.scoreDisplay.classList.remove('score-pulse'), 300);
        this.updateScoreboardDisplay();
    }
    handleWicket(clickVal) {
        const currentBatter = this.batsmen[this.currentBatsmanIndex];
        this.playerStats[currentBatter].out = true;
        this.currentWickets += 1;
        // Audio effects
        this.sound.playWicket();
        // Visual Wicket effects
        this.showToast('OUT!', 'out');
        this.triggerFlashEffect('out');
        // Neat Console Output Logger
        console.log(`%c☝️ [OUT] %c${currentBatter} %cis OUT! %c(Missed Timing) | Timing: %c${clickVal.toFixed(3)}%c | Final Batter Score: %c${this.playerStats[currentBatter].runs} (${this.playerStats[currentBatter].balls}b)%c | Score: %c${this.currentRuns}/${this.currentWickets}%c`, 'font-size: 1.1rem;', 'color: #ff0055; font-weight: bold;', 'color: #ff0055; font-weight: bold;', 'color: #8f9ca8; font-style: italic;', 'color: #ffffff; background: #222; padding: 2px 5px; border-radius: 3px;', '', 'color: #ffd700; font-weight: bold;', '', 'color: #ffffff; font-weight: bold; background: #c80036; padding: 1px 4px; border-radius: 3px;', '');
        this.dom.scoreDisplay.classList.add('wicket-shake');
        this.dom.batsmanAvatar.classList.add('out-anim');
        setTimeout(() => this.dom.scoreDisplay.classList.remove('wicket-shake'), 400);
        this.updateScoreboardDisplay();
        // Rotate to next player
        this.nextBatsman();
    }
    nextBatsman() {
        // Increment wickets
        if (this.currentWickets < 3) {
            setTimeout(() => {
                this.currentBatsmanIndex += 1;
                this.resetAvatarAnimation();
                this.updateScoreboardDisplay();
                // Re-enable swing button
                this.dom.btnBat.disabled = false;
                this.isSwinging = false;
                this.showToast(`Batsman: ${this.batsmen[this.currentBatsmanIndex]} takes strike!`, 'perfect');
            }, 1200); // Give user time to see the wicket fall
        }
        else {
            // 3 Wickets down: Game Over
            setTimeout(() => {
                this.endGame();
            }, 1500);
        }
    }
    resetAvatarAnimation() {
        const currentBatter = this.batsmen[this.currentBatsmanIndex];
        // Clear animations on avatar
        this.dom.batsmanAvatar.className = 'cricket-avatar';
        this.dom.batsmanAvatar.textContent = '🏏';
        // Set Batter Tag name
        this.dom.batterTag.textContent = currentBatter;
        this.dom.batterTag.style.borderColor =
            this.currentBatsmanIndex === 0 ? 'var(--neon-cyan)' :
                this.currentBatsmanIndex === 1 ? 'var(--neon-green)' : 'var(--neon-yellow)';
    }
    triggerFlashEffect(type) {
        this.dom.pitchOverlay.className = `pitch-overlay ${type}-flash`;
        setTimeout(() => {
            this.dom.pitchOverlay.className = 'pitch-overlay';
        }, 500);
    }
    updateScoreboardDisplay() {
        const currentBatter = this.batsmen[this.currentBatsmanIndex];
        const stats = this.playerStats[currentBatter];
        this.dom.scoreBatsman.textContent = currentBatter;
        this.dom.batsmanIndividualScore.innerHTML = `${stats.runs}* <span class="balls-faced">(${stats.balls}b)</span>`;
        this.dom.scoreDisplay.textContent = `${this.currentRuns}/${this.currentWickets}`;
        this.dom.scoreBalls.textContent = this.currentBalls.toString();
    }
    // 10. Game Over Screen
    async endGame() {
        this.isPlaying = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        // Hide actions header during Game Over screen
        this.dom.gameHeader.classList.add('hidden');
        // Compile individual player runs for saving
        const runsMap = {
            Rohit: this.playerStats.Rohit.runs,
            Virat: this.playerStats.Virat.runs,
            Dhoni: this.playerStats.Dhoni.runs
        };
        // Save and check for high score
        const isNewHighScore = await this.saveScoreRecord(this.currentRuns, runsMap);
        // Populate Game Over Scorecard
        this.dom.summaryTotalScore.textContent = `${this.currentRuns}/${this.currentWickets}`;
        this.dom.summaryHighScore.textContent = this.highestScore.toString();
        // Individual rows details
        this.batsmen.forEach((p) => {
            const stats = this.playerStats[p];
            const runsEl = document.getElementById(`summary-${p.toLowerCase()}-runs`);
            const ballsEl = document.getElementById(`summary-${p.toLowerCase()}-balls`);
            const srEl = document.getElementById(`summary-${p.toLowerCase()}-sr`);
            if (runsEl)
                runsEl.textContent = stats.runs.toString();
            if (ballsEl)
                ballsEl.textContent = `(${stats.balls}b)`;
            if (srEl) {
                const sr = stats.balls > 0 ? (stats.runs / stats.balls) * 100 : 0.0;
                srEl.textContent = sr.toFixed(2);
            }
        });
        // High Score celebration display
        if (isNewHighScore) {
            this.dom.newHighScoreBanner.classList.remove('hidden');
            this.sound.playHighScore();
            this.showToast('NEW HIGH SCORE RECORDED!', 'six');
        }
        else {
            this.dom.newHighScoreBanner.classList.add('hidden');
        }
        // Switch Screens
        this.dom.gameScreen.classList.add('hidden');
        this.dom.gameOverScreen.classList.remove('hidden');
    }
    // 11. Screen Routing
    goToLanding() {
        this.isPlaying = false;
        this.isPaused = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.renderLandingStats();
        this.dom.gameScreen.classList.add('hidden');
        this.dom.gameOverScreen.classList.add('hidden');
        this.dom.gameHeader.classList.add('hidden');
        this.dom.landingScreen.classList.remove('hidden');
    }
    // 12. Modal Handlers
    pauseGame() {
        if (!this.isPlaying || this.isPaused)
            return;
        this.isPaused = true;
        this.dom.pauseModal.classList.remove('hidden');
    }
    resumeGame() {
        if (!this.isPlaying || !this.isPaused)
            return;
        this.isPaused = false;
        this.dom.pauseModal.classList.add('hidden');
        this.startTimingBarLoop(); // Resume animation loop
    }
    // 13. Toast alerts utility
    showToast(message, style) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${style}`;
        // Add specific visual icons based on style
        let icon = '';
        if (style === 'six')
            icon = '🌟';
        else if (style === 'four')
            icon = '⚡';
        else if (style === 'out')
            icon = '☝️';
        else if (style === 'perfect')
            icon = '🔥';
        toast.innerHTML = `${icon ? `<span>${icon}</span>` : ''} ${message}`;
        this.dom.toastContainer.appendChild(toast);
        // Slide out and remove toast after timing duration
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px) scale(0.9)';
            toast.style.transition = 'opacity 0.25s, transform 0.25s';
            setTimeout(() => {
                toast.remove();
            }, 250);
        }, 1800);
    }
}
// 14. Load application on DOM Ready
window.addEventListener('DOMContentLoaded', () => {
    const game = new GameController();
    game.init();
});
//# sourceMappingURL=app.js.map