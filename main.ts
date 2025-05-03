import { App, Plugin, PluginSettingTab, Setting, ItemView, WorkspaceLeaf, setIcon, IconName } from 'obsidian';
import * as React from 'react';
import { Root, createRoot } from 'react-dom/client';
// import TimerView from "./views/TimerView"
import AddTasksView from "./views/AddTasksView"
import TimerView from 'views/TimerView';

interface PomodoroTimerSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: PomodoroTimerSettings = {
	mySetting: 'default'
}

// View Types
export const ADD_TASKS_VIEW_TYPE = "add-tasks-view"
export const TIMER_VIEW_TYPE = "timer-view"

class ADD_TASKS_VIEW extends ItemView {
	root: Root | null = null;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return ADD_TASKS_VIEW_TYPE;
	}

	// Name of view
	getDisplayText() {
		return 'Pomodoro Timer: Add Tasks';
	}

	getIcon(): string {
		return "timer"
	}

	async onOpen() {
		this.root = createRoot(this.containerEl.children[1]);
		const domNode = React.createElement(AddTasksView, {app: this.app})

		this.root.render(domNode);
	}

	async onClose() {
		this.root?.unmount();
	}
}

class TIMER_VIEW extends ItemView {
	root: Root | null = null;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return TIMER_VIEW_TYPE;
	}

	// Name of view
	getDisplayText() {
		return 'Pomodoro Timer';
	}

	getIcon(): string {
		return "timer"
	}

	async onOpen() {
		this.root = createRoot(this.containerEl.children[1]);
		const domNode = React.createElement(TimerView)

		this.root.render(domNode)
	}

	async onClose() {
		this.root?.unmount();
	}
}

export default class PomodoroTimerPlugin extends Plugin {
	settings: PomodoroTimerSettings;
	root: Root | null = null;
	containerEl: HTMLElement;

	async onload() {
		await this.loadSettings();

		// Adds views
		this.registerView(ADD_TASKS_VIEW_TYPE, (leaf) => new ADD_TASKS_VIEW(leaf));
		this.registerView(TIMER_VIEW_TYPE, (leaf) => new TIMER_VIEW(leaf));

		this.addRibbonIcon("timer", "Start Pomodoro Timer", () => {
			this.activateView();
		});

		// adds settings tab
		this.addSettingTab(new SampleSettingTab(this.app, this));

	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(ADD_TASKS_VIEW_TYPE);

		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else {
			// Our view could not be found in the workspace, create a new leaf in the right sidebar for it
			leaf = workspace.getRightLeaf(false);
			if (leaf) await leaf.setViewState({ type: ADD_TASKS_VIEW_TYPE, active: true });
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		if (leaf) workspace.revealLeaf(leaf);
	}

	onunload() {
		this.root?.unmount();
		this.containerEl.remove();
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


class SampleSettingTab extends PluginSettingTab {
	plugin: PomodoroTimerPlugin;

	constructor(app: App, plugin: PomodoroTimerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
