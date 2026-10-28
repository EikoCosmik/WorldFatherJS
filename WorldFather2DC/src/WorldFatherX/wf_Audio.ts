//REPLACE WITH SCENE OR ENTITY INBUILD

// export class audioManager
// {
// 	static AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
// 	static audioContext: AudioContext = new this.AudioContextClass();

// 	public constructor(){}

// 	static playBeep(frequency: number = 440, duration: number = 0.1): void
// 	{
// 		const oscillator: OscillatorNode = new OscillatorNode(this.audioContext, { type: "sine", frequency: frequency });
// 		const gainNode: GainNode = new GainNode(this.audioContext, { gain: 0.1 });

// 		// Connect the nodes: Oscillator -> Gain (Volume) -> Speakers
// 		oscillator.connect(gainNode);
// 		gainNode.connect(this.audioContext.destination);

// 		// Play immediately and stop after the duration
// 		oscillator.start();
// 		oscillator.stop(this.audioContext.currentTime + duration);
// 	}
// }