// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./BethToken.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

contract BethelInvoice {
    // Token contract
    BethToken public bethtoken;

    // Event to log the Invoice Creation
    event InvoiceCreated(address indexed creator, uint256 invoiceNo, bool created);

    // Event to log the purchase
    event StoragePurchased( address indexed buyer, uint256 amount, Packages package, bool paid);

    constructor(address tokenAddress) {
        bethtoken = BethToken(tokenAddress);
    }

    // Enum for different storage packages
    enum Packages {
        Basic,
        Profesional,
        Business,
        PayAsYouGo
    }

    struct Invoice {
        string did;
        address owner;  // public address
        uint256 invoiceNo;
        Packages packageType;
        uint256 amount;
        uint256 createdAt;
        uint256 expiredAt;
        bool paid;
    }

    // Structure for a user
    struct User {
        string did;
        address owner;
        Invoice[] invoices;
    }

    // Mapping to store user's invoices
    // did => User
    mapping(string => User) public users;

    // // did => invoiceNo[]
    // mapping(string => Invoice[]) public invoiceArray;

    // Mapping to store amount of the invoice under invoiceNo
    // invoiceNo => amount
    // mapping(string => uint256)
    // mapping(string => mapping(uint256 => uint25))
    // mapping(uint256 => uint256) public price;
    mapping(string => mapping(uint256 => uint256)) public price;

    // Function that calculate the storage cost based on the selected package
    function calculateStorageCost(Packages _package) internal pure returns (uint256) {
        if (_package == Packages.Basic) {
            return 100; // Set the cost for the Basic package
        } else if (_package == Packages.Profesional) {
            return 200; // Set the cost for Package2
        } else if (_package == Packages.Business) {
            return 300; // Set the cost for Package3
        } else if (_package == Packages.PayAsYouGo) {
            return 50; // Set the cost for PayAsYouGo
        }

        revert("Invalid package"); // Revert if an invalid package is provided
    }

    // Function that updates an existing invoice
    function updateInvoiceList(string memory _did, Packages _package, uint256 _amount) internal returns (bool success) {
        // Create invoice
        Invoice memory invoice = Invoice({
            did: _did,
            owner: msg.sender,
            invoiceNo: users[_did].invoices.length + 1,
            packageType: _package,
            amount: _amount,
            createdAt: block.timestamp,
            expiredAt: block.timestamp + 30 days,
            paid: true
        });

        // Update User.invoices
        // users[_did].invoices.push(invoice);

        User storage newUser = users[_did];
        newUser.did = _did;
        newUser.owner = msg.sender;
        newUser.invoices.push(invoice);

        users[_did] = newUser;

        // invoiceArray[_did].push(invoice);

        emit InvoiceCreated(msg.sender,invoice.invoiceNo, true);

        return true;
    }

    // Function that creates an invoice
    function createInvoice(string memory _did, Packages _package) public returns (bool success) {
        // Checks that inputs are given
        require(bytes(_did).length > 0, "User DID is required");
        // require(_amount > 0, "Amount must be greater than 0");

        // Determine the storage cost based on the selected package
        uint256 cost = calculateStorageCost(_package);

        // // Transfer tokens from the user to the contract
        // bethtoken.transferFrom(msg.sender, address(this), cost);

        // Check that if there is a existed user for given did
        User memory existingUser = users[_did];

        if (existingUser.invoices.length > 0) {
            // User already exists, call the updateInvoice function
            updateInvoiceList(_did, _package, cost);
        } else {
            // Create a new user and invoice
            Invoice memory invoice = Invoice({
                did: _did,
                owner: msg.sender,
                invoiceNo: 1,
                packageType: _package,
                amount: cost,
                createdAt: block.timestamp,
                expiredAt: block.timestamp + 30 days,
                paid: true
            });
            
            // 
            // User memory newUser = User({
            //     did: _did,
            //     owner: msg.sender,
            //     invoices: new Invoice[](0)
            // }); 

            // Create a new user with the invoice
            User storage newUser = users[_did];
            newUser.did = _did;
            newUser.owner = msg.sender;
            newUser.invoices.push(invoice);

            // User memory newUser  = User ({
            //     did: _did,
            //     owner: msg.sender,
            //     invoices: inArray
            // });

            users[_did] = newUser;

            // Update price mapping
            // price[invoice.invoiceNo] = cost;

            // uint256[] storage arry;
            // arry.push(invoice.invoiceNo);

            // // --------------
            // invoiceArray[_did].push(invoice);

            emit InvoiceCreated(msg.sender,invoice.invoiceNo, true);
        }

        return true;
    }

    // Function that Pay to invoice created
    function payInvoice(string memory _did, Packages _package) public returns(bool success){
        uint256 cost = calculateStorageCost(_package);

        // Transfer tokens from the user to the contract
        bethtoken.transferFrom(msg.sender, address(this), cost);

        Invoice[] memory  invoices = users[_did].invoices;

        Invoice memory lastInvoice = invoices[invoices.length-1];

        // Update price mapping
        // price[lastInvoice.invoiceNo] = cost;
        price[_did][lastInvoice.invoiceNo] = cost;

        emit StoragePurchased(msg.sender,cost, _package, true);

        return true;

    }
}

//200000000000000000000
