# Project Description

**Deployed Frontend URL:** https://crowdsol-dapp.vercel.app/

**Solana Program ID:** GWUmGEUeq7RyM99r22zPdLfxNcKN6SwpjVa128JrXpCU

## Project Overview

### Description
<!-- [TODO: Provide a comprehensive description of your dApp. Explain what it does. Be detailed about the core functionality.] -->
CrowdSol is a crowdfunding platform where users can initiate projects and ask for funds for it. A project is set with a duration between one week and 3 months, a goal of funds, a title and a description. It's participative fundings, all users can send Solana to contribute in the development of the project and the funds are locked in a `CSPVault`. Each participation is represented on chain by a `UserParticipation` account. When the project reach the end, the owner of the vault can withdraw the funds collected with the withdraw function.

### Key Features
<!-- [TODO: List the main features of your dApp. Be specific about what users can do.] -->

- Feature 1: Create a crowdfunding
    - User can create a crowdfunding with the specifications described in the `CSPVault`. He can add a duration, a title, a description and a funds goal for the campaign.
- Feature 2: Participate/Donate in a crowdfunding 
    - User can send SOL to the crowdfunding project, he can add a comment with his donation. On chain the participation is represented by a `UserParticipation` account.
- Feature 3: Withdraw funds of a crowdfunding
    - The owner of the crowdfunding project can withdraw the funds when his campaign is ended.
  
### How to Use the dApp
<!-- [TODO: Provide step-by-step instructions for users to interact with your dApp] -->

**Create a crowd funding project :**

1. **Connect Wallet**
2. **Main Action 1:** Go to the CrowdSol DApp, and click on 'Create a Project'
3. **Main Action 2:** Fill the form an click on the button to create a project
4. **Main Action 3:** Wallet open, sign the transaction
5. `CSPVault` is created

**Donate to a project :**

1. **Connect Wallet**
2. **Main Action 1:** Go to the CrowdSol DApp, and click on 'Projects'
3. **Main Action 2:** Fill the form with amount and a comment, and click on the button to create a project
4. **Main Action 3:** Wallet open, sign the transaction, funds are sent
5. `UserParticipation` is created

**Donate to a project :**

1. **Connect Wallet**
2. **Main Action 1:** Go to the CrowdSol DApp, and click on 'Withdraw'
3. **Main Action 2:** Click on the Withdraw
4. **Main Action 3:** Wallet open, sign the transaction, funds are sent back to the owner
5. `UserParticipation` is created

## Program Architecture
<!-- [TODO: Describe your Solana program's architecture. Explain the main instructions, account structures, and data flow.] -->

### PDA Usage
<!-- [TODO: Explain how you implemented Program Derived Addresses (PDAs) in your project. What seeds do you use and why?] -->

**PDAs Used:**
- PDA 1 for `CSPVault`: The PDA is derived like this :
    ```rust
    CSP_VAULT = "csp_vault"
    seeds = [CSP_VAULT.as_bytes(), vault_creator.key().as_ref()],
    ``` 
    I implement this PDA to be sure the vault for the project is 'linked' to the vault creator which is the signer of the `create_funding` instruction.

- PDA 2 for the `UserParticipation`: The PDA is derived like this :
    ```rust
    USER_PARTICIPATION = "user_participation"
        seeds = [USER_PARTICIPATION.as_bytes(), vault.key().as_ref(), participant.key().as_ref(), vault.nonce.to_le_bytes().as_ref()],
    ``` 
    This PDA is used to be sure the user participation is unique. We use the "user_participation" string at the beginning, the vault pubkey, the participant pubkey and a nonce incremented at each `donate` transaction on the vault. This guarantee the pda is unique for the vault and the participant, and if the participant had already make a donation, the nonce of the vault make the pda unique.

### Program Instructions
<!-- [TODO: List and describe all the instructions in your Solana program] -->

**Instructions Implemented:**
- Instruction 1: `create_funding`( **duration**: u64, **funds_goal**: u64, **title**: String, **description**: String) is used to create a crowdfunding project. It create a `CSPVault` account for the user/signer. The instruction check if the inputs parameters are correct (e.g. good duration, title and description not excess the max length)

- Instruction 2: `participate`( **amount**: u64, **comment**: String) is used to donate/send funds to a `CSPVault`. The instruction check is the project vault is open to receive funds (if it not reach the end), if the comment not excess the max length and if the amount is not zero. After that a `UserParticipation` unique adress is created to make a print of the user donation to the project.
- Instruction 3: `withdraw_funding`() is used by the owner of the `CSPVault` to withdraw the funds when the project reach the end. the instruction check if the `CSPVault` reach the end, if the signer is the owner and if the funds are not already withdrawn.

### Account Structure
<!-- [TODO: Describe your main account structures and their purposes] -->

```rust
#[account]
#[derive(InitSpace)]
pub struct CSPVault {
    pub owner: Pubkey,
    pub begin: u64,
    pub duration: u64,
    #[max_len(TITLE_LENGTH)]
    pub title: String,
    #[max_len(DESC_LENGTH)]
    pub description: String,
    pub amount: u64,
    pub funds_goal: u64,
    pub nonce: u64,
    pub status: VaultStatus,
    pub bump: u8,
}
#[account]
#[derive(InitSpace)]
pub struct UserParticipation {
    pub user: Pubkey,
    pub csp_vault: Pubkey,
    pub time: u64,
    pub amount: u64,
        #[max_len(COMMENT_LENGTH)]
    pub comment: String,
    pub vault_nonce: u64,
    pub bump: u8,
}
```

## Testing

### Test Coverage
<!-- [TODO: Describe your testing approach and what scenarios you covered] -->
Tests suite implemented to check happy and unhappy paths for the 3 instruction of the CrowdSol program.

**Happy Path Tests:**
- **Create a funding** : Check if a funding project is correctly created and the account infos are correct.
- **Donate to a funding** : Create a funding project and donate to this project.
- **Withdraw funding** : Create a funding project, two users donate to this project and at the end the owner can withdraw the funds

**Unhappy Path Tests:**

**Create funding**

- **Create a funding should fail with shorter duration** : Check if the funding project creation fail if the duration is too short.
- **Create a funding should fail with higher duration** : Check if the funding project creation fail if the duration is high short.
- **Create a funding should fail with too long title** : Check if the funding project creation fail if the title is too long.
- **Create a funding should fail with too long description** : Check if the funding project creation fail if the description is too long.

**Donate**

- **Donate to a funding should fail if comment is too long** : Check if donate to a `CSPVault` fail if the comment is too long.
- **Donate to a funding should fail if amount is zero** : Check if donate to a `CSPVault` fail if the amount is zero.

**Withdraw**

- **Withdraw from a funding should fail if it's not the owner** : Check if withdraw on a `CSPVault` fail if you are not the owner of it.



### Running Tests
```bash
# Commands to run your tests
anchor test
```

### Additional Notes for Evaluators

<!-- [TODO: Add any specific notes or context that would help evaluators understand your project better] -->

I already know how the PDA works, it's first time I make a real reflection on a program creation on Solana, I'm usually more on the auditing side than the building side. I also have trouble to understand how to implement the wallet with the frontend DApp, I learn a lot of things about building DApp in general.